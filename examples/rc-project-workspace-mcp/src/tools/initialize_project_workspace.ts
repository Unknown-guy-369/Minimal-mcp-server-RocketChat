import { rcClient } from "../rc-client.js";
import { z } from "zod";

export const tool = {
  name: "initialize_project_workspace",
  description: "High-level orchestration: Create a private group, add members, setup an integration webhook, and post a project brief.",
  inputSchema: z.object({
    projectName: z.string().describe("The name of the project (used for group name)"),
    members: z.array(z.string()).describe("Array of user IDs to add to the group"),
    projectBrief: z.string().describe("A brief description/announcement for the project"),
    webhookName: z.string().describe("Name for the incoming webhook integration"),
    webhookUsername: z.string().describe("Username that the webhook will post as")
  }),
  handler: async (args: any) => {
    const { projectName, members, projectBrief, webhookName, webhookUsername } = args;

    // 1. Create Private Group
    console.error(`[Init] Creating private group: ${projectName}...`);
    const createRes = await rcClient.request("POST", "/api/v1/groups.create", {
      body: { name: projectName }
    });
    if (createRes.isError) return createRes;

    let rid: string;
    try {
      const groupData = JSON.parse(createRes.content[0].text);
      rid = groupData.group?._id || groupData._id;
    } catch (e) {
      return { content: [{ type: "text" as const, text: "Failed to parse group creation response." }], isError: true };
    }

    // 2. Add Project Members
    console.error(`[Init] Inviting ${members.length} members to ${rid}...`);
    for (const uid of members) {
      await rcClient.request("POST", "/api/v1/groups.invite", {
        body: { roomId: rid, userId: uid }
      });
    }

    // 3. Setup Integration Webhook
    console.error(`[Init] Setting up webhook: ${webhookName}...`);
    const integrationRes = await rcClient.request("POST", "/api/v1/integrations.create", {
      body: {
        type: "webhook-incoming",
        name: webhookName,
        enabled: true,
        username: webhookUsername,
        channel: `#${projectName}`, // Target the new group
        scriptEnabled: false
      }
    });

    let webhookUrl = "Integration setup failed or URL not returned";
    if (!integrationRes.isError) {
      try {
        const intData = JSON.parse(integrationRes.content[0].text);
        webhookUrl = intData.integration?.url || webhookUrl;
      } catch (e) {}
    }

    // 4. Post Project Brief
    console.error(`[Init] Posting project brief...`);
    await rcClient.request("POST", "/api/v1/chat.postMessage", {
      body: {
        roomId: rid,
        text: `🚀 *Project Workspace Initialized: ${projectName}*\n\n*Brief:* ${projectBrief}\n\n*Members:* ${members.length} joined.\n*Webhook URL:* \`${webhookUrl}\``
      }
    });

    return {
      content: [{ 
        type: "text" as const, 
        text: `✅ Project workspace "${projectName}" initialized successfully.\n- Room ID: ${rid}\n- Members added: ${members.length}\n- Webhook: ${webhookUrl}` 
      }]
    };
  }
};
