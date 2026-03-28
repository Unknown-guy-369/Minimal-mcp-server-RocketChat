import { describe, it, expect, vi, beforeEach } from "vitest";
import { tool } from "../src/tools/post_api_v1_integrations_remove.js";
import { rcClient } from "../src/rc-client.js";

describe("Tool: post_api_v1_integrations_remove", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports correct name and description", () => {
    expect(tool.name).toBe("post_api_v1_integrations_remove");
    expect(tool.description).toBe("integrations.remove(integrationId:o, type:o)");
  });

  it("validates input schema with valid arguments", () => {
    const validArgs = {
      integrationId: "test_string",
      type: "test_string",
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
      integrationId: "test_string",
      type: "test_string",
    };

    await tool.handler(mockArgs);

    expect(rcClient.request).toHaveBeenCalledTimes(1);
    
    // Validate request routing
    let expectedPath = "/api/v1/integrations.remove";
    if (mockArgs.integrationId !== undefined) {
      const value = encodeURIComponent(String(mockArgs.integrationId));
      expectedPath = expectedPath.replace("{" + "integrationId" + "}", value);
      expectedPath = expectedPath.replace("integrationId", value);
    }
    if (mockArgs.type !== undefined) {
      const value = encodeURIComponent(String(mockArgs.type));
      expectedPath = expectedPath.replace("{" + "type" + "}", value);
      expectedPath = expectedPath.replace("type", value);
    }

    expect(rcClient.request).toHaveBeenCalledWith(
      "POST",
      expectedPath,
      { body: mockArgs }
    );
  });
});
