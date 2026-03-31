import { rcClient } from "../rc-client.js";
import { z } from "zod";

export const tool = {
  name: "moderate_message",
  description: "High-level moderation tool: Delete a message, deactivate the user, and report the action to a moderator channel.",
  inputSchema: z.object({
    messageId: z.string().describe("The ID of the message to delete"),
    roomId: z.string().describe("The Room ID where the message is located"),
    userId: z.string().describe("The ID of the user to deactivate"),
    moderatorChannelId: z.string().describe("The Room ID of the channel to send the moderation report to"),
    reason: z.string().describe("Reason for moderation")
  }),
  handler: async (args: any) => {
    // 1. Get Message Content for the report
    console.error(`[Moderation] Fetching message ${args.messageId}...`);
    const getMsgRes = await rcClient.request("GET", `/api/v1/chat.getMessage?messageId=${args.messageId}`);
    let messageText = "Content not available";
    if (!getMsgRes.isError) {
      try {
        const msgData = JSON.parse(getMsgRes.content[0].text);
        messageText = msgData.message?.msg || messageText;
      } catch (e) {}
    }

    // 2. Delete Message
    console.error(`[Moderation] Deleting message ${args.messageId}...`);
    const deleteRes = await rcClient.request("POST", "/api/v1/chat.delete", {
      body: {
        roomId: args.roomId,
        msgId: args.messageId
      }
    });

    if (deleteRes.isError) {
       return { content: [{ type: "text" as const, text: `Failed to delete message: ${deleteRes.content[0].text}` }], isError: true };
    }

    // 3. Deactivate User
    console.error(`[Moderation] Deactivating user ${args.userId}...`);
    const deactivateRes = await rcClient.request("POST", "/api/v1/users.setActiveStatus", {
      body: {
        activeStatus: false,
        userId: args.userId,
        confirmRelinquish: true
      }
    });

    let userDeactivated = !deactivateRes.isError;

    // 4. Send Report to Moderator Channel
    console.error(`[Moderation] Sending report to ${args.moderatorChannelId}...`);
    const reportText = `🚨 *Moderation Action Taken*\n- *Action:* Message Deleted & User Deactivated\n- *User ID:* ${args.userId}\n- *Room ID:* ${args.roomId}\n- *Reason:* ${args.reason}\n- *Original Content:* _${messageText}_`;
    
    await rcClient.request("POST", "/api/v1/chat.postMessage", {
      body: {
        roomId: args.moderatorChannelId,
        text: reportText
      }
    });

    return {
      content: [{ 
        type: "text" as const, 
        text: `✅ Moderation complete.\n- Message ${args.messageId} deleted.\n- User ${args.userId} ${userDeactivated ? "deactivated" : "deactivation failed"}.\n- Report sent to ${args.moderatorChannelId}.` 
      }]
    };
  }
};
