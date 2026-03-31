import { describe, it, expect, vi, beforeEach } from "vitest";
import { tool } from "../src/tools/post_api_v1_users_setActiveStatus.js";
import { rcClient } from "../src/rc-client.js";

describe("Tool: post_api_v1_users_setActiveStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports correct name and description", () => {
    expect(tool.name).toBe("post_api_v1_users_setActiveStatus");
    expect(tool.description).toBe("users.setActiveStatus(activeStatus:o, uid:o, [confirmRelinquish:o])");
  });

  it("validates input schema with valid arguments", () => {
    const validArgs = {
      activeStatus: true,
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
      activeStatus: true,
      userId: "test_string",
      confirmRelinquish: true,
    };

    await tool.handler(mockArgs);

    expect(rcClient.request).toHaveBeenCalledTimes(1);
    
    // Validate request routing
    let expectedPath = "/api/v1/users.setActiveStatus";
    if (mockArgs.activeStatus !== undefined) {
      const value = encodeURIComponent(String(mockArgs.activeStatus));
      expectedPath = expectedPath.replace("{" + "activeStatus" + "}", value);
      expectedPath = expectedPath.replace("activeStatus", value);
    }
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
