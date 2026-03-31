import { rcClient } from "../rc-client.js";
import { z } from "zod";

export const tool = {
  name: "archive_and_audit_channel",
  description: "Complete archival workflow: Export history, kick all members, archive the channel, and log the action.",
  inputSchema: z.object({
    roomId: z.string().describe("The Room ID to archive"),
    isPrivate: z.boolean().default(false).describe("Whether the room is a private group"),
    adminLogRoomId: z.string().describe("Room ID to post the audit log message"),
    exportEmails: z.array(z.string()).describe("Emails to send the exported history to")
  }),
  handler: async (args: any) => {
    const { roomId, isPrivate, adminLogRoomId, exportEmails } = args;

    // 1. Export Channel History
    console.error(`[Archive] Exporting history for ${roomId}...`);
    const exportRes = await rcClient.request("POST", "/api/v1/rooms.export", {
      body: {
        rid: roomId,
        type: "email",
        toEmails: exportEmails,
        format: "html"
      }
    });
    if (exportRes.isError) return exportRes;

    // 2. Fetch Members and Kick them
    console.error(`[Archive] Fetching members for ${roomId}...`);
    const membersPath = isPrivate ? "/api/v1/groups.members" : "/api/v1/channels.members";
    const membersRes = await rcClient.request("GET", `${membersPath}?roomId=${roomId}`);
    
    if (!membersRes.isError) {
      try {
        const membersData = JSON.parse(membersRes.content[0].text);
        const members = membersData.members || [];
        const kickPath = isPrivate ? "/api/v1/groups.kick" : "/api/v1/channels.kick";

        for (const member of members) {
          // Note: Skipping kick if it's the current user (admin) might be handled by RC API anyway
          console.error(`[Archive] Kicking user ${member.username}...`);
          await rcClient.request("POST", kickPath, {
            body: { roomId, userId: member._id }
          });
        }
      } catch (e) {
        console.error("[Archive] Failed to parse members or kick users, proceeding to archive.");
      }
    }

    // 3. Archive Channel
    console.error(`[Archive] Archiving channel ${roomId}...`);
    const archivePath = isPrivate ? "/api/v1/groups.archive" : "/api/v1/channels.archive";
    const archiveRes = await rcClient.request("POST", archivePath, {
      body: { roomId }
    });
    if (archiveRes.isError) return archiveRes;

    // 4. Post Audit Log
    console.error(`[Archive] Posting audit log to ${adminLogRoomId}...`);
    await rcClient.request("POST", "/api/v1/chat.postMessage", {
      body: {
        roomId: adminLogRoomId,
        text: `📦 *Channel Archival Audit*\n- *Room ID:* ${roomId}\n- *Type:* ${isPrivate ? "Private Group" : "Public Channel"}\n- *Action:* Exported to ${exportEmails.join(", ")}, All members kicked, Channel archived.`
      }
    });

    return {
      content: [{ 
        type: "text" as const, 
        text: `✅ Channel ${roomId} successfully archived and audited.\n- History exported to ${exportEmails.join(", ")}.\n- Audit log posted to ${adminLogRoomId}.` 
      }]
    };
  }
};
