import { describe, it, expect, vi, beforeEach } from "vitest";
import { tool } from "../src/tools/post_api_v1_chat_delete.js";
import { rcClient } from "../src/rc-client.js";

describe("Tool: post_api_v1_chat_delete", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports correct name and description", () => {
    expect(tool.name).toBe("post_api_v1_chat_delete");
    expect(tool.description).toBe("chat.del(rid:o, mid:o, [asUser:o])");
  });

  it("validates input schema with valid arguments", () => {
    const validArgs = {
      roomId: "test_string",
      msgId: "test_string",
      asUser: true,
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
      roomId: "test_string",
      msgId: "test_string",
      asUser: true,
    };

    await tool.handler(mockArgs);

    expect(rcClient.request).toHaveBeenCalledTimes(1);
    
    // Validate request routing
    let expectedPath = "/api/v1/chat.delete";
    if (mockArgs.roomId !== undefined) {
      const value = encodeURIComponent(String(mockArgs.roomId));
      expectedPath = expectedPath.replace("{" + "roomId" + "}", value);
      expectedPath = expectedPath.replace("roomId", value);
    }
    if (mockArgs.msgId !== undefined) {
      const value = encodeURIComponent(String(mockArgs.msgId));
      expectedPath = expectedPath.replace("{" + "msgId" + "}", value);
      expectedPath = expectedPath.replace("msgId", value);
    }
    if (mockArgs.asUser !== undefined) {
      const value = encodeURIComponent(String(mockArgs.asUser));
      expectedPath = expectedPath.replace("{" + "asUser" + "}", value);
      expectedPath = expectedPath.replace("asUser", value);
    }

    expect(rcClient.request).toHaveBeenCalledWith(
      "POST",
      expectedPath,
      { body: mockArgs }
    );
  });
});
