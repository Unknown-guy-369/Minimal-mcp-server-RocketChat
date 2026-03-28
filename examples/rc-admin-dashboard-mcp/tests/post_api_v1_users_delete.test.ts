import { describe, it, expect, vi, beforeEach } from "vitest";
import { tool } from "../src/tools/post_api_v1_users_delete.js";
import { rcClient } from "../src/rc-client.js";

describe("Tool: post_api_v1_users_delete", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports correct name and description", () => {
    expect(tool.name).toBe("post_api_v1_users_delete");
    expect(tool.description).toBe("users.del(uid:o, [confirmRelinquish:o])");
  });

  it("validates input schema with valid arguments", () => {
    const validArgs = {
      userId: "test_string",
      confirmRelinquish: true,
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
      confirmRelinquish: true,
    };

    await tool.handler(mockArgs);

    expect(rcClient.request).toHaveBeenCalledTimes(1);
    
    // Validate request routing
    let expectedPath = "/api/v1/users.delete";
    if (mockArgs.userId !== undefined) {
      const value = encodeURIComponent(String(mockArgs.userId));
      expectedPath = expectedPath.replace("{" + "userId" + "}", value);
      expectedPath = expectedPath.replace("userId", value);
    }
    if (mockArgs.confirmRelinquish !== undefined) {
      const value = encodeURIComponent(String(mockArgs.confirmRelinquish));
      expectedPath = expectedPath.replace("{" + "confirmRelinquish" + "}", value);
      expectedPath = expectedPath.replace("confirmRelinquish", value);
    }

    expect(rcClient.request).toHaveBeenCalledWith(
      "POST",
      expectedPath,
      { body: mockArgs }
    );
  });
});
