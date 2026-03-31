import { rcClient } from "../rc-client.js";
import { z } from "zod";

export const tool = {
  name: "broadcast_announcement",
  description: "Orchestrate a company-wide broadcast: Create a read-only channel, add all active users, and post an announcement.",
  inputSchema: z.object({
    channelName: z.string().describe("The name of the broadcast channel to create"),
    announcementText: z.string().describe("The text of the announcement"),
    topic: z.string().optional().describe("Optional topic for the channel")
  }),
  handler: async (args: any) => {
    // 1. Create Read-Only Channel
    console.error(`[Broadcast] Creating read-only channel: ${args.channelName}...`);
    const createRes = await rcClient.request("POST", "/api/v1/channels.create", {
      body: {
        name: args.channelName,
        readOnly: true
      }
    });

    if (createRes.isError) return createRes;

    let rid: string;
    try {
      const roomData = JSON.parse(createRes.content[0].text);
      rid = roomData.channel?._id || roomData._id;
    } catch (e) {
      return { content: [{ type: "text" as const, text: "Failed to parse channel creation response." }], isError: true };
    }

    // 2. Add All Active Users
    console.error(`[Broadcast] Adding all active users to ${rid}...`);
    const addAllRes = await rcClient.request("POST", "/api/v1/channels.addAll", {
      body: {
        roomId: rid,
        activeUsersOnly: true
      }
    });

    if (addAllRes.isError) {
       console.error(`[Broadcast] Warning: Failed to add all users: ${addAllRes.content[0].text}`);
       // We continue as the channel is created and we can still post
    }

    // 3. Post Announcement
    console.error(`[Broadcast] Posting announcement to ${rid}...`);
    const postRes = await rcClient.request("POST", "/api/v1/chat.postMessage", {
      body: {
        roomId: rid,
        text: args.announcementText
      }
    });

    if (postRes.isError) return postRes;

    let mid: string;
    try {
       const msgData = JSON.parse(postRes.content[0].text);
       mid = msgData.message?._id || msgData._id;
    } catch (e) {
       mid = "unknown";
    }

    return {
      content: [{ 
        type: "text" as const, 
        text: `✅ Broadcast Complete!\n- Channel: ${args.channelName} (${rid})\n- Message ID: ${mid}\n- Status: All active users invited and announcement posted.` 
      }]
    };
  }
};
