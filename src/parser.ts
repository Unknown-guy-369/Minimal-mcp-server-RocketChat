import SwaggerParser from "@apidevtools/swagger-parser";
import axios from "axios";
import yaml from "js-yaml";

console.log("Parser started...");

// --- Interfaces ---
export interface EndpointParam {
  name: string;
  type: string;       // Zod type: "string" | "boolean" | "number"
  required: boolean;
}

export interface Endpoint {
  toolName: string;      // e.g., "chat_delete"
  method: string;        // "POST"
  path: string;          // "/api/v1/chat.delete"
  toonHeader: string;    // CRITICAL: e.g., "chat.del(rid:s, mid:s)"
  params: EndpointParam[];
}

// --- TOON Shorthand Maps ---
const TYPE_MAP: Record<string, string> = {
  string: "s",
  boolean: "b",
  number: "n",
  array: "a",
  integer: "n",
};

// Reverse map: OpenAPI type -> Zod method name
const ZOD_TYPE_MAP: Record<string, string> = {
  string: "string()",
  boolean: "boolean()",
  number: "number()",
  integer: "number()",
  array: "array(z.any())",
};

const PARAM_MAP: Record<string, string> = {
  roomId: "rid",
  msgId: "mid",
  userId: "uid",
  username: "u",
  text: "m",
};

import fs from "node:fs/promises";
import path from "node:path";

const manifestPath = path.resolve("manifest.json");

export async function fetchSpec(domainName: string): Promise<any> {
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf-8"));
  const domain = manifest.domains[domainName];
  
  if (!domain) {
    throw new Error(`Domain "${domainName}" not found in manifest.`);
  }

  const url = `${manifest.base_url}${domain.file}`;
  console.log(`Fetching: ${url}`);
  try {
    const { data } = await axios.get(url);
    return yaml.load(data);
  } catch (err: any) {
    throw new Error(`Failed to fetch ${domainName} (${url}): ${err.message}`);
  }
}

const OP_MAP: Record<string, string> = {
  delete: "del",
  update: "upd",
  postMessage: "post",
  sendMessage: "send",
  create: "new",
  list: "ls",
  info: "get",
  setAnnouncement: "setAnn",
};

export async function toonify(specName: string): Promise<string[]> {
  try {
    const rawSpec = await fetchSpec(specName);
    const dereferenced = (await SwaggerParser.dereference(rawSpec as any)) as any;

    const results: string[] = [];

    if (!dereferenced.paths) return [];

    for (const [path, methods] of Object.entries(dereferenced.paths)) {
      for (const [method, operation] of Object.entries(methods as any)) {
        // Skip non-HTTP method keys from OpenAPI spec
        if (method === "parameters" || method === "summary" || method === "description") continue;

        const op = operation as any;
        if (!op.operationId) continue;
        
        // Logical tool name generation
        let logicalName = path.replace("/api/v1/", "").replace(/\./g, "_");
        const parts = logicalName.split("_");
        const action = parts[parts.length - 1];
        const resource = parts[0];
        
        const shortAction = OP_MAP[action] || action;
        const finalName = parts.length > 1 ? `${resource}.${shortAction}` : shortAction;

        const body = op.requestBody?.content?.["application/json"]?.schema?.properties || {};
        const params = Object.entries(body).map(([name, schema]: [string, any]) => {
          const shortName = PARAM_MAP[name] || name;
          const shortType = TYPE_MAP[schema.type] || "o";
          const isRequired = op.requestBody?.content?.["application/json"]?.schema?.required?.includes(name);
          return isRequired ? `${shortName}:${shortType}` : `[${shortName}:${shortType}]`;
        });

        results.push(`${method.toUpperCase()} ${path} ➔ ${finalName}(${params.join(", ")})`);
      }
    }

    return results;
  } catch (err: any) {
    console.error(`Toonify Error: ${err.message}`);
    return [];
  }
}

/**
 * Extracts structured Endpoint objects from a domain spec.
 * Unlike toonify() which returns flat strings, this returns data
 * the generator can feed directly into Handlebars templates.
 */
export async function extractEndpoints(domainName: string): Promise<{
  endpoints: Endpoint[];
  audit: { originalTokens: number; toonTokens: number; savingsPercentage: string };
}> {
  try {
    const rawSpec = await fetchSpec(domainName);
    const dereferenced = (await SwaggerParser.dereference(rawSpec as any)) as any;

    const endpoints: Endpoint[] = [];

    if (!dereferenced.paths) return { endpoints: [] as Endpoint[], audit: { originalTokens: 0, toonTokens: 0, savingsPercentage: "0.0" } };

    for (const [apiPath, methods] of Object.entries(dereferenced.paths)) {
      for (const [method, operation] of Object.entries(methods as any)) {
        // Skip non-HTTP method keys from OpenAPI spec
        if (method === "parameters" || method === "summary" || method === "description") continue;

        const op = operation as any;
        if (!op.operationId) continue;

        // THE SANITIZER: Generate a safe, atomic tool name
        // 1. Use operationId if available, else fallback to method_path
        let rawName = op.operationId || `${method}_${apiPath}`;
        // 2. Remove curly braces: {_id} -> _id
        // 3. Replace slashes, dashes, and dots with underscores
        // 4. Remove consecutive underscores and trim
        const toolName = rawName
          .replace(/[{}]/g, "")
          .replace(/[\/\-\.]/g, "_")
          .replace(/_+/g, "_")
          .replace(/^_|_$/g, "");

        // Generate TOON header
        let logicalName = apiPath.replace("/api/v1/", "").replace(/\./g, "_");
        const parts = logicalName.split("_");
        const action = parts[parts.length - 1];
        const resource = parts[0];
        const shortAction = OP_MAP[action] || action;
        const finalName = parts.length > 1 ? `${resource}.${shortAction}` : shortAction;

        // Extract params
        const body = op.requestBody?.content?.["application/json"]?.schema?.properties || {};
        const requiredFields: string[] = op.requestBody?.content?.["application/json"]?.schema?.required || [];

        const params: EndpointParam[] = Object.entries(body).map(([name, schema]: [string, any]) => ({
          name,
          type: ZOD_TYPE_MAP[schema.type] || "string()",
          required: requiredFields.includes(name),
        }));

        // Build TOON header string
        const toonParams = params.map(p => {
          const shortName = PARAM_MAP[p.name] || p.name;
          const shortType = TYPE_MAP[p.type === "number" ? "number" : p.type] || "o";
          return p.required ? `${shortName}:${shortType}` : `[${shortName}:${shortType}]`;
        });
        const toonHeader = `${finalName}(${toonParams.join(", ")})`;

        endpoints.push({
          toolName,
          method: method.toUpperCase(),
          path: apiPath,
          toonHeader,
          params,
        });
      }
    }

    // Calculate TOON savings audit
    const originalTokens = endpoints.reduce((sum, ep) => sum + JSON.stringify(ep).length, 0);
    const toonTokens = endpoints.reduce((sum, ep) => sum + ep.toonHeader.length, 0);
    const savingsPercentage = originalTokens > 0
      ? ((1 - toonTokens / originalTokens) * 100).toFixed(1)
      : "0.0";

    return {
      endpoints,
      audit: { originalTokens, toonTokens, savingsPercentage },
    };
  } catch (err: any) {
    console.error(`extractEndpoints Error: ${err.message}`);
    return { endpoints: [], audit: { originalTokens: 0, toonTokens: 0, savingsPercentage: "0.0" } };
  }
}

