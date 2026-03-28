# Project Context & History: Rocket.Chat MCP Architect

## 🎯 Overview
This project is a specialized MCP (Model Context Protocol) server designed to surgically extract functionality from the Rocket.Chat OpenAPI specifications and generate minimal, production-ready MCP servers. It utilizes **TOON (Token-Oriented Object Notation)** to minimize context bloat.

## 🏗️ Architecture
- **Server (`src/index.ts`)**: Main MCP entry point utilizing a **Two-Tool Architecture**:
  1. `explore_rc_api`: Explores the YAML and returns TOON summaries for LLM review.
  2. `scaffold_mcp_server`: Generates the physical project from approved domains.
- **Parser (`src/parser.ts`)**: Fetches YAML specs, converts them to TOON shorthand strings, and extracts structured `Endpoint` objects for generation mapping.
- **Generator (`src/generator.ts`)**: The Execution Engine. It takes parsed domains, compiles Handlebars templates, scaffolds the directory structure, writes the core files, and automatically runs `npm install` post-generation.
- **Templates (`templates/`)**: The "DNA" of the generated project.
  - `server.hbs`: The generated server's `index.ts`, dynamically registering selected tools.
  - `rc-client.hbs`: A native, token-aware HTTP client with built-in **429 Exponential Backoff** and **8KB Payload Truncation** to protect LLM context windows.
  - `tool.hbs`: Blueprint for individual tool endpoints with Zod validation.
  - `package.hbs` & `tsconfig.hbs`: Boilerplate configurations.
- **Manifest (`manifest.json`)**: Mapping of functional domains to OpenAPI files and keywords.
- **Layer 3: Zero-Regression Test Scaffolding**: Generating code is only half the battle; ensuring it works safely in an agentic loop is the other. Alongside the TypeScript tools, the execution engine automatically scaffolds a localized testing suite (using native node:test or vitest). For every operationId selected by the LLM, the generator writes a corresponding `[tool].test.ts` file. These tests automatically mock the Rocket.Chat API client and validate the generated Zod schemas against edge-case inputs. This ensures that the generated MCP server has proven integrity before the end-user ever connects it to their production workspace.

## 📜 History & Milestones
- **2026-03-25**: Initial setup and basic scaffolding logic.
- **2026-03-25**: Refactored `src/index.ts` to align with the latest `McpServer.registerTool` API signature.
- **2026-03-25**: Implemented Phase 1 (Template Expansion). Created `server.hbs`, `rc-client.hbs`, `package.hbs`, and `tsconfig.hbs` templates.
- **2026-03-25**: Implemented Phase 2 (Execution Engine). Built `src/generator.ts`, updated `parser.ts` to extract structured endpoint arrays, and implemented the Two-Tool Architecture to prevent LLM hallucination of endpoints. 
- **2026-03-25**: Updated `scaffold_mcp_server` schema so `projectName` is optional and falls back to AI intent-based naming.

## 🛠️ Tech Stack
- **Runtime**: Node.js / TypeScript
- **Protocol**: MCP (Model Context Protocol)
- **Schema**: Zod
- **Templating**: Handlebars
- **Testing**: Vitest

## 💡 Key Decisions
1. **TOON Transformation**: Verbose JSON schemas are compressed (e.g., `string` ➔ `s`, `boolean` ➔ `b`) to save ~75% of token budget during AI tool-calling.
2. **Surgical Extraction**: Instead of full API wrappers, the generator creates focused tools based on specific user requirements.
3. **Template-Based Scaffolding**: Uses Handlebars for consistent code generation across different MCP tools.
4. **LLM Context Protection**: The generated HTTP client automatically truncates payloads that exceed 8KB to prevent crashing the agent's context window.
5. **Two-Step Generation**: Separating exploration (`explore_rc_api`) from generation (`scaffold_mcp_server`) ensures no hallucinated endpoints are written into code.

## 📋 10 Mandatory Workflows
**The "Self-Testing" Guarantee:**
For every one of the 10 mandatory workflows generated (e.g., the Moderation Bot, the Support Bot), the Master Architect will not just output the server code. It will also output a dedicated test file for every single endpoint utilized in that workflow, proving to the user that the LLM's selected toolchain is structurally sound and type-safe.

## 📅 Project Timeline
**Week 9-10: Automated Test Scaffolding & Post-Gen DX**
- Implement the `tests/setup.ts` Handlebars template to create a localized mock-fetch environment for the child servers.
- Build the test generator logic: For every `src/tools/[name].ts` generated, autonomously generate a `tests/[name].test.ts` file that tests the Zod `inputSchema` and the HTTP routing.
- Implement `child_process` hooks to automatically run `npm install`, `tsc --noEmit`, and `npm test` immediately after scaffolding, giving the user instant verification that the generated server is flawless.
