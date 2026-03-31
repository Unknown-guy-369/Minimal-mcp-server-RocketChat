import { rcClient } from "../rc-client.js";
import { z } from "zod";

export const tool = {
  name: "get_message_metrics",
  description: "Retrieve and format reaction metrics for a broadcast message.",
  inputSchema: z.object({
    messageId: z.string().describe("The ID of the message to collect metrics for")
  }),
  handler: async (args: any) => {
    console.error(`[Metrics] Fetching message ${args.messageId}...`);
    const res = await rcClient.request("GET", `/api/v1/chat.getMessage?messageId=${args.messageId}`);
    
    if (res.isError) return res;

    try {
      const data = JSON.parse(res.content[0].text);
      const msg = data.message;
      const reactions = msg.reactions || {};
      
      let metricText = `📊 *Reaction Metrics for Message* \`${args.messageId}\`\n`;
      const reactionSummary = Object.keys(reactions).map(emoji => {
        const count = reactions[emoji].usernames.length;
        return `- ${emoji}: ${count} reaction(s)`;
      }).join("\n");

      return {
        content: [{ 
          type: "text" as const, 
          text: metricText + (reactionSummary || "No reactions collected yet.")
        }]
      };
    } catch (e) {
      return { content: [{ type: "text" as const, text: "Failed to parse message metrics." }], isError: true };
    }
  }
};
