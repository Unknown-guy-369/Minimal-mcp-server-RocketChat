import { describe, it, expect, vi, beforeEach } from "vitest";
import { tool } from "../src/tools/post_api_v1_livechat_inquiries_take.js";
import { rcClient } from "../src/rc-client.js";

describe("Tool: post_api_v1_livechat_inquiries_take", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports correct name and description", () => {
    expect(tool.name).toBe("post_api_v1_livechat_inquiries_take");
    expect(tool.description).toBe("livechat/inquiries.take(inquiryId:o, [uid:o])");
  });

  it("validates input schema with valid arguments", () => {
    const validArgs = {
      inquiryId: "test_string",
      userId: "test_string",
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
      inquiryId: "test_string",
      userId: "test_string",
    };

    await tool.handler(mockArgs);

    expect(rcClient.request).toHaveBeenCalledTimes(1);
    
    // Validate request routing
    let expectedPath = "/api/v1/livechat/inquiries.take";
    if (mockArgs.inquiryId !== undefined) {
      const value = encodeURIComponent(String(mockArgs.inquiryId));
      expectedPath = expectedPath.replace("{" + "inquiryId" + "}", value);
      expectedPath = expectedPath.replace("inquiryId", value);
    }
    if (mockArgs.userId !== undefined) {
      const value = encodeURIComponent(String(mockArgs.userId));
      expectedPath = expectedPath.replace("{" + "userId" + "}", value);
      expectedPath = expectedPath.replace("userId", value);
    }

    expect(rcClient.request).toHaveBeenCalledWith(
      "POST",
      expectedPath,
      { body: mockArgs }
    );
  });
});
