import { describe, it, expect, vi, beforeEach } from "vitest";
import { tool } from "../src/tools/post_api_v1_moderation_dismissReports.js";
import { rcClient } from "../src/rc-client.js";

describe("Tool: post_api_v1_moderation_dismissReports", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports correct name and description", () => {
    expect(tool.name).toBe("post_api_v1_moderation_dismissReports");
    expect(tool.description).toBe("moderation.dismissReports([uid:o], [mid:o])");
  });

  it("validates input schema with valid arguments", () => {
    const validArgs = {
      userId: "test_string",
      msgId: "test_string",
    };
    
    const result = tool.inputSchema.safeParse(validArgs);
    expect(result.success).toBe(true);
  });


  it("calls rcClient.request with correct method, path, and payload", async () => {
    const mockArgs = {
      userId: "test_string",
      msgId: "test_string",
    };

    await tool.handler(mockArgs);

    expect(rcClient.request).toHaveBeenCalledTimes(1);
    
    // Validate request routing
    let expectedPath = "/api/v1/moderation.dismissReports";
    if (mockArgs.userId !== undefined) {
      const value = encodeURIComponent(String(mockArgs.userId));
      expectedPath = expectedPath.replace("{" + "userId" + "}", value);
      expectedPath = expectedPath.replace("userId", value);
    }
    if (mockArgs.msgId !== undefined) {
      const value = encodeURIComponent(String(mockArgs.msgId));
      expectedPath = expectedPath.replace("{" + "msgId" + "}", value);
      expectedPath = expectedPath.replace("msgId", value);
    }

    expect(rcClient.request).toHaveBeenCalledWith(
      "POST",
      expectedPath,
      { body: mockArgs }
    );
  });
});
