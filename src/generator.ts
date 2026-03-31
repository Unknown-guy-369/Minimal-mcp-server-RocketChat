import fs from "node:fs/promises";
import path from "node:path";
import Handlebars from "handlebars";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import type { Endpoint } from "./parser.js";

const execAsync = promisify(exec);

// --- Orchestration Metadata (optional, provided by Gemini or the LLM agent) ---
export interface OrchestrationStep {
  label: string;   // e.g., "Retrieve Context"
  detail: string;  // e.g., "Fetches the original message content for the report."
}

export interface OrchestrationMeta {
  name: string;           // e.g., "moderate_message"
  description: string;    // One-liner summary
  steps: OrchestrationStep[];
}

export async function generateProjectFiles(
  projectDir: string,
  projectName: string,
  endpoints: Endpoint[],
  orchestration?: OrchestrationMeta,
) {
  const srcDir = path.join(projectDir, "src");
  const toolsDir = path.join(srcDir, "tools");
  const testsDir = path.join(projectDir, "tests");

  // 1. Scaffold Directories
  await fs.mkdir(toolsDir, { recursive: true });
  await fs.mkdir(testsDir, { recursive: true });

  Handlebars.registerHelper("eq", (a, b) => a === b);
  Handlebars.registerHelper("hasRequired", (params) => params && params.some((p: any) => p.required));
  // Increment helper for 1-based numbering in templates: {{inc @index}}
  Handlebars.registerHelper("inc", (value: number) => value + 1);

  // 2. Load and Compile Templates
  const toolTpl = Handlebars.compile(await fs.readFile("templates/tool.hbs", "utf-8"));
  const serverTpl = Handlebars.compile(await fs.readFile("templates/server.hbs", "utf-8"));
  const clientTpl = Handlebars.compile(await fs.readFile("templates/rc-client.hbs", "utf-8"));
  const pkgTpl = Handlebars.compile(await fs.readFile("templates/package.hbs", "utf-8"));
  const tsconfigTpl = Handlebars.compile(await fs.readFile("templates/tsconfig.hbs", "utf-8"));
  const setupTpl = Handlebars.compile(await fs.readFile("templates/setup.hbs", "utf-8"));
  const testTpl = Handlebars.compile(await fs.readFile("templates/test.hbs", "utf-8"));
  const vitestConfigTpl = Handlebars.compile(await fs.readFile("templates/vitest.config.hbs", "utf-8"));
  const readmeTpl = Handlebars.compile(await fs.readFile("templates/readme.hbs", "utf-8"));

  // 3. Write Tools & Tests
  const toolNames = [];
  for (const ep of endpoints) {
    const code = toolTpl(ep);
    await fs.writeFile(path.join(toolsDir, `${ep.toolName}.ts`), code);

    const testCode = testTpl(ep);
    await fs.writeFile(path.join(testsDir, `${ep.toolName}.test.ts`), testCode);

    toolNames.push(ep.toolName);
  }

  // 4. Write Core Files & Setup
  await fs.writeFile(path.join(srcDir, "server.ts"), serverTpl({ projectName, toolNames }));
  await fs.writeFile(path.join(srcDir, "rc-client.ts"), clientTpl({}));
  await fs.writeFile(path.join(projectDir, "package.json"), pkgTpl({ projectName }));
  await fs.writeFile(path.join(projectDir, "tsconfig.json"), tsconfigTpl({}));
  await fs.writeFile(path.join(projectDir, "vitest.config.ts"), vitestConfigTpl({}));
  await fs.writeFile(path.join(testsDir, "setup.ts"), setupTpl({}));
  await fs.writeFile(path.join(projectDir, "README.md"), readmeTpl({
    projectName,
    projectDir,
    toolNames,
    endpoints,
    orchestration: orchestration || null,
  }));

  // 5. Write Environment Template
  const envContent = `ROCKETCHAT_URL=http://localhost:3000\nROCKETCHAT_USER=\nROCKETCHAT_PASSWORD=\nROCKETCHAT_AUTH_TOKEN=\nROCKETCHAT_USER_ID=\n`;
  await fs.writeFile(path.join(projectDir, ".env.example"), envContent);

  // 6. Post-Generation DX — Self-Testing Guarantee
  const verification = { install: "⏳", typeCheck: "⏳", tests: "⏳", testDetails: "" };

  console.log(`[Architect] Scaffolding complete. Running Self-Testing Guarantee in ${projectDir}...`);
  try {
    await execAsync("npm install", { cwd: projectDir });
    verification.install = "✅ Passed";
    console.log(`[Architect] Dependencies installed.`);
    
    await execAsync("npx tsc --noEmit", { cwd: projectDir });
    verification.typeCheck = "✅ Passed";
    console.log(`[Architect] Type-Check passed.`);
    
    const { stdout: testOutput } = await execAsync("npm run test", { cwd: projectDir });
    verification.tests = "✅ Passed";
    verification.testDetails = testOutput;
    console.log(`[Architect] Zero-Regression Tests passed.`);
  } catch (error: any) {
    if (verification.install === "⏳") verification.install = "❌ Failed";
    else if (verification.typeCheck === "⏳") verification.typeCheck = "❌ Failed";
    else if (verification.tests === "⏳") {
      verification.tests = "❌ Failed";
      verification.testDetails = error.stdout || error.message;
    }
    console.warn(`[Architect] Verification issue: ${error.message}`);
  }

  // Build Self-Testing Guarantee Report
  const testFiles = endpoints.map(ep => `  - tests/${ep.toolName}.test.ts`).join("\n");
  const report = [
    `Project "${projectName}" generated with ${endpoints.length} tools at ${projectDir}.`,
    ``,
    `📁 Generated Test Files:`,
    testFiles,
    ``,
    `🛡️ Self-Testing Guarantee Report:`,
    `  npm install:   ${verification.install}`,
    `  tsc --noEmit:  ${verification.typeCheck}`,
    `  vitest run:    ${verification.tests}`,
  ].join("\n");

  return report;
}
