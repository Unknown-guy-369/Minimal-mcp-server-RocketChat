import { rcClient } from "../rc-client.js";
import { z } from "zod";

export const tool = {
  name: "provision_vendor_guest",
  description: "High-level tool to provision a vendor guest: Create account, invite to channel, set expiration, and notify sponsor.",
  inputSchema: z.object({
    name: z.string().describe("Full name of the vendor guest"),
    email: z.string().describe("Email of the vendor guest"),
    username: z.string().describe("Username for the vendor guest"),
    password: z.string().describe("Password for the vendor guest"),
    vendorChannelId: z.string().describe("The Room ID of the vendor-specific channel"),
    isPrivateChannel: z.boolean().default(false).describe("Whether the vendor channel is private (group)"),
    expirationDate: z.string().describe("Expiration date of the account (e.g., YYYY-MM-DD)"),
    sponsorUserId: z.string().describe("User ID of the internal sponsor to notify")
  }),
  handler: async (args: any) => {
    // 1. Create Guest Account
    console.error(`[Provisioning] Creating guest account for ${args.username}...`);
    const createRes = await rcClient.request("POST", "/api/v1/users.create", {
      body: {
        name: args.name,
        email: args.email,
        username: args.username,
        password: args.password,
        roles: ["guest"],
        customFields: {
           expirationDate: args.expirationDate
        }
      }
    });
    if (createRes.isError) return createRes;

    let guestUid: string;
    try {
      const userData = JSON.parse(createRes.content[0].text);
      guestUid = userData.user?._id || userData._id;
    } catch (e) {
      return { content: [{ type: "text" as const, text: "Failed to parse user creation response." }], isError: true };
    }

    if (!guestUid) {
        return { content: [{ type: "text" as const, text: "User created but ID not found in response." }], isError: true };
    }

    // 2. Invite to Channel
    console.error(`[Provisioning] Inviting ${guestUid} to channel ${args.vendorChannelId}...`);
    const invitePath = args.isPrivateChannel ? "/api/v1/groups.invite" : "/api/v1/channels.invite";
    const inviteRes = await rcClient.request("POST", invitePath, {
      body: {
        roomId: args.vendorChannelId,
        userId: guestUid
      }
    });
    
    if (inviteRes.isError) {
       return { 
         content: [{ type: "text" as const, text: `User created (${guestUid}) but invite failed: ${inviteRes.content[0].text}` }],
         isError: true 
       };
    }

    // 3. DM Internal Sponsor
    console.error(`[Provisioning] Notifying sponsor ${args.sponsorUserId}...`);
    const dmCreateRes = await rcClient.request("POST", "/api/v1/im.create", {
      body: { username: args.sponsorUserId }
    });

    if (!dmCreateRes.isError) {
      try {
        const dmData = JSON.parse(dmCreateRes.content[0].text);
        const dmRid = dmData.room?._id || dmData.rid;
        if (dmRid) {
          await rcClient.request("POST", "/api/v1/chat.postMessage", {
            body: {
              roomId: dmRid,
              text: `🚀 *Vendor Guest Provisioned*\n- *Name:* ${args.name}\n- *Username:* @${args.username}\n- *Channel:* ${args.vendorChannelId}\n- *Expiration:* ${args.expirationDate}`
            }
          });
        }
      } catch (e) {
        console.error("[Provisioning] Failed to notify sponsor via DM.");
      }
    }

    return {
      content: [{ 
        type: "text" as const, 
        text: `✅ Successfully provisioned vendor guest ${args.name} (@${args.username}).\n- User ID: ${guestUid}\n- Invited to: ${args.vendorChannelId}\n- Expiration: ${args.expirationDate}` 
      }]
    };
  }
};
