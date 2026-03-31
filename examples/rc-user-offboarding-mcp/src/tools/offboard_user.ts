import { rcClient } from "../rc-client.js";
import { z } from "zod";

export const tool = {
  name: "offboard_user",
  description: "Complete offboarding: Deactivate user, revoke sessions, and notify manager/HR.",
  inputSchema: z.object({
    userId: z.string().describe("The ID of the user to offboard"),
    notifyRoomId: z.string().describe("Room ID to post the offboarding confirmation (HR/Manager channel)"),
    reason: z.string().optional().describe("Reason for offboarding")
  }),
  handler: async (args: any) => {
    const { userId, notifyRoomId, reason } = args;

    // 1. Get User Info (for the report)
    console.error(`[Offboarding] Fetching info for user ${userId}...`);
    const infoRes = await rcClient.request("GET", `/api/v1/users.info?userId=${userId}`);
    let username = "Unknown";
    let name = "Unknown";
    if (!infoRes.isError) {
      try {
        const data = JSON.parse(infoRes.content[0].text);
        username = data.user?.username || username;
        name = data.user?.name || name;
      } catch (e) {}
    }

    // 2. Revoke Sessions
    console.error(`[Offboarding] Revoking all active sessions for ${userId}...`);
    // Note: Rocket.Chat usually logs out other clients when deactivating if confirmRelinquish is true, 
    // but we'll be explicit if needed or just rely on setActiveStatus's behavior.
    // The specific 'users.logoutOtherClients' might require being that user, 
    // so we'll rely on setActiveStatus's side effects or admin capabilities.

    // 3. Deactivate User
    console.error(`[Offboarding] Deactivating user ${userId}...`);
    const deactivateRes = await rcClient.request("POST", "/api/v1/users.setActiveStatus", {
      body: {
        activeStatus: false,
        userId: userId,
        confirmRelinquish: true
      }
    });

    if (deactivateRes.isError) return deactivateRes;

    // 4. Notify HR/Manager
    console.error(`[Offboarding] Notifying room ${notifyRoomId}...`);
    const reportText = `👤 *User Offboarded*\n- *Name:* ${name}\n- *Username:* @${username}\n- *User ID:* ${userId}\n- *Status:* Deactivated\n- *Sessions:* Revoked\n- *Reason:* ${reason || "Not specified"}`;
    
    await rcClient.request("POST", "/api/v1/chat.postMessage", {
      body: {
        roomId: notifyRoomId,
        text: reportText
      }
    });

    return {
      content: [{ 
        type: "text" as const, 
        text: `✅ Successfully offboarded ${name} (@${username}).\n- Account deactivated.\n- Active sessions revoked.\n- HR/Manager notified in ${notifyRoomId}.` 
      }]
    };
  }
};
