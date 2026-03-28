import { describe, it, expect, vi, beforeEach } from "vitest";
import { tool } from "../src/tools/post_api_v1_settings_id.js";
import { rcClient } from "../src/rc-client.js";

describe("Tool: post_api_v1_settings_id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports correct name and description", () => {
    expect(tool.name).toBe("post_api_v1_settings_id");
    expect(tool.description).toBe("settings/{.id}(value:o, [color:o], [editor:o], [execute:o])");
  });

  it("validates input schema with valid arguments", () => {
    const validArgs = {
      value: "test_string",
      color: "test_string",
      editor: "test_string",
      execute: true,
    };
    
    const result = tool.inputSchema.safeParse(validArgs);
    expect(result.success).toBe(true);
  });

  it("fails validation when required arguments are missing", () => {
    const result = tool.inputSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("calls rcClient.request with correct method, path, and payload", async () => {
    const mockArgs = {
      value: "test_string",
      color: "test_string",
      editor: "test_string",
      execute: true,
    };

    await tool.handler(mockArgs);

    expect(rcClient.request).toHaveBeenCalledTimes(1);
    
    // Validate request routing
    let expectedPath = "/api/v1/settings/{_id}";
    if (mockArgs.value !== undefined) {
      const value = encodeURIComponent(String(mockArgs.value));
      expectedPath = expectedPath.replace("{" + "value" + "}", value);
      expectedPath = expectedPath.replace("value", value);
    }
    if (mockArgs.color !== undefined) {
      const value = encodeURIComponent(String(mockArgs.color));
      expectedPath = expectedPath.replace("{" + "color" + "}", value);
      expectedPath = expectedPath.replace("color", value);
    }
    if (mockArgs.editor !== undefined) {
      const value = encodeURIComponent(String(mockArgs.editor));
      expectedPath = expectedPath.replace("{" + "editor" + "}", value);
      expectedPath = expectedPath.replace("editor", value);
    }
    if (mockArgs.execute !== undefined) {
      const value = encodeURIComponent(String(mockArgs.execute));
      expectedPath = expectedPath.replace("{" + "execute" + "}", value);
      expectedPath = expectedPath.replace("execute", value);
    }

    expect(rcClient.request).toHaveBeenCalledWith(
      "POST",
      expectedPath,
      { body: mockArgs }
    );
  });
});
