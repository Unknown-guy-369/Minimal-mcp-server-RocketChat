import { describe, it, expect, vi, beforeEach } from "vitest";
import { tool } from "../src/tools/post_api_v1_users_update.js";
import { rcClient } from "../src/rc-client.js";

describe("Tool: post_api_v1_users_update", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports correct name and description", () => {
    expect(tool.name).toBe("post_api_v1_users_update");
    expect(tool.description).toBe("users.upd(uid:o, data:o)");
  });

  it("validates input schema with valid arguments", () => {
    const validArgs = {
      userId: "test_string",
      data: "test_string",
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
      userId: "test_string",
      data: "test_string",
    };

    await tool.handler(mockArgs);

    expect(rcClient.request).toHaveBeenCalledTimes(1);
    
    // Validate request routing
    let expectedPath = "/api/v1/users.update";
    if (mockArgs.userId !== undefined) {
      const value = encodeURIComponent(String(mockArgs.userId));
      expectedPath = expectedPath.replace("{" + "userId" + "}", value);
      expectedPath = expectedPath.replace("userId", value);
    }
    if (mockArgs.data !== undefined) {
      const value = encodeURIComponent(String(mockArgs.data));
      expectedPath = expectedPath.replace("{" + "data" + "}", value);
      expectedPath = expectedPath.replace("data", value);
    }

    expect(rcClient.request).toHaveBeenCalledWith(
      "POST",
      expectedPath,
      { body: mockArgs }
    );
  });
});
