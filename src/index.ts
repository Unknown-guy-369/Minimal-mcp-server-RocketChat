import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { extractEndpoints } from "./parser.js";
import { generateProjectFiles } from "./generator.js";
import fs from "node:fs/promises";
import path from "node:path";

const server = new McpServer({ 
  name: "RC-Master-Architect", 
  version: "1.0.0" 
});

//  THE CACHE: Stores structured endpoints temporarily between Tool 1 and Tool 2
const endpointCache = new Map<string, any>();

// ─── Tool 1: Explore ────────────────────────────────────────────────
server.registerTool(
  "explore_rc_api",
  {
    description: "Scan Rocket.Chat OpenAPI specs and return TOON-compressed endpoint summaries.",
    inputSchema: {
      requirement: z.string().describe("e.g., 'I need to delete messages and manage roles'"),
    }
  },
  async ({ requirement }) => {
    const manifest = JSON.parse(await fs.readFile("manifest.json", "utf-8"));
    const selectedDomains: string[] = [];

    for (const [domainId, domain] of Object.entries(manifest.domains) as [string, any][]) {
      if (domain.keywords.some((k: string) => requirement.toLowerCase().includes(k.toLowerCase()))) {
        selectedDomains.push(domainId);
      }
    }

    if (selectedDomains.length === 0) {
      return { isError: true, content: [{ type: "text", text: "No matching API domains found." }] };
    }

    let summaryText = `Found domains: [${selectedDomains.join(", ")}]\n\n`;

    // Fetch structured data, cache it, and build the TOON string for the LLM
    for (const domainId of selectedDomains) {
      const { endpoints, audit } = await extractEndpoints(domainId);
      
      summaryText += `--- ${domainId.toUpperCase()} (Savings: ${audit.savingsPercentage}%) ---\n`;
      
      for (const ep of endpoints) {
        endpointCache.set(ep.toolName, ep); // Save to cache
        summaryText += `- ${ep.toolName}: ${ep.toonHeader}\n`;
      }
      summaryText += `\n`;
    }

    summaryText += `INSTRUCTION FOR AGENT: Review the TOON headers above. Select the exact 'toolName' strings you need, and pass them as an array of strings to the 'scaffold_mcp_server' tool's 'selectedToolNames' parameter.`;

    return { content: [{ type: "text", text: summaryText }] };
  }
);

// ─── Tool 2: Scaffold ───────────────────────────────────────────────
server.registerTool(
  "scaffold_mcp_server",
  {
    description: "Generate a Minimal MCP server project using specific toolNames. Optionally include an orchestration workflow.",
    inputSchema: {
      projectName: z.string().optional().describe("Auto-generate a descriptive kebab-case name based on intent (e.g., 'rc-stats-bot')."),
      selectedToolNames: z.array(z.string()).describe("Array of specific toolNames from the explore_rc_api output (e.g. ['users.create', 'chat.delete'])."),
      orchestration: z.object({
        name: z.string().describe("Name of the high-level orchestration tool (e.g., 'moderate_message')."),
        description: z.string().describe("One-liner summarising the orchestration workflow."),
        steps: z.array(z.object({
          label: z.string().describe("Step label (e.g., 'Retrieve Context')."),
          detail: z.string().describe("What this step does."),
        })).describe("Ordered steps the orchestration tool performs."),
      }).optional().describe("Optional high-level workflow that composes the atomic tools into a single operation."),
    }
  },
  async ({ projectName, selectedToolNames, orchestration }) => {
    // Fallback name if LLM forgets
    const finalName = (projectName && projectName.trim()) ? projectName.replace(/\s+/g, '-') : `rc-${selectedToolNames[0]?.replace('.', '-')}-bot`;

    // Pluck ONLY the requested endpoints from the cache
    const endpointsToBuild = selectedToolNames
      .map(name => endpointCache.get(name))
      .filter(Boolean); // removes undefined if LLM hallucinates a name

    if (endpointsToBuild.length === 0) {
      return {
        isError: true,
        content: [{ type: "text", text: `Error: Could not find those toolNames in the cache. Did you run explore_rc_api first in this session? Requested: ${selectedToolNames.join(", ")}` }]
      };
    }

    // Generate the minimal project inside examples/
    const projectPath = path.resolve("examples", finalName);
    const result = await generateProjectFiles(projectPath, finalName, endpointsToBuild, orchestration);

    return { content: [{ type: "text", text: `${result}\n\nTo run: cd examples/${finalName} && npm install && npm start` }] };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("RC-Master-Architect running. Ready for Two-Tool Orchestration.");