import { describe, it, expect, vi, beforeEach } from "vitest";
import { tool } from "../src/tools/post_api_v1_chat_pinMessage.js";
import { rcClient } from "../src/rc-client.js";

describe("Tool: post_api_v1_chat_pinMessage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports correct name and description", () => {
    expect(tool.name).toBe("post_api_v1_chat_pinMessage");
    expect(tool.description).toBe("chat.pinMessage(messageId:o)");
  });

  it("validates input schema with valid arguments", () => {
    const validArgs = {
      messageId: "test_string",
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
      messageId: "test_string",
    };

    await tool.handler(mockArgs);

    expect(rcClient.request).toHaveBeenCalledTimes(1);
    
    // Validate request routing
    let expectedPath = "/api/v1/chat.pinMessage";
    if (mockArgs.messageId !== undefined) {
      const value = encodeURIComponent(String(mockArgs.messageId));
      expectedPath = expectedPath.replace("{" + "messageId" + "}", value);
      expectedPath = expectedPath.replace("messageId", value);
    }

    expect(rcClient.request).toHaveBeenCalledWith(
      "POST",
      expectedPath,
      { body: mockArgs }
    );
  });
});
