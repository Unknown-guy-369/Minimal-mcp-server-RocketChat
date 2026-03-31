import { describe, it, expect, vi, beforeEach } from "vitest";
import { tool } from "../src/tools/post_api_v1_livechat_message.js";
import { rcClient } from "../src/rc-client.js";

describe("Tool: post_api_v1_livechat_message", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports correct name and description", () => {
    expect(tool.name).toBe("post_api_v1_livechat_message");
    expect(tool.description).toBe("livechat/message(token:o, rid:o, msg:o, [_id:o], [agent:o])");
  });

  it("validates input schema with valid arguments", () => {
    const validArgs = {
      token: "test_string",
      rid: "test_string",
      msg: "test_string",
      _id: "test_string",
      agent: "test_string",
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
      token: "test_string",
      rid: "test_string",
      msg: "test_string",
      _id: "test_string",
      agent: "test_string",
    };

    await tool.handler(mockArgs);

    expect(rcClient.request).toHaveBeenCalledTimes(1);
    
    // Validate request routing
    let expectedPath = "/api/v1/livechat/message";
    if (mockArgs.token !== undefined) {
      const value = encodeURIComponent(String(mockArgs.token));
      expectedPath = expectedPath.replace("{" + "token" + "}", value);
      expectedPath = expectedPath.replace("token", value);
    }
    if (mockArgs.rid !== undefined) {
      const value = encodeURIComponent(String(mockArgs.rid));
      expectedPath = expectedPath.replace("{" + "rid" + "}", value);
      expectedPath = expectedPath.replace("rid", value);
    }
    if (mockArgs.msg !== undefined) {
      const value = encodeURIComponent(String(mockArgs.msg));
      expectedPath = expectedPath.replace("{" + "msg" + "}", value);
      expectedPath = expectedPath.replace("msg", value);
    }
    if (mockArgs._id !== undefined) {
      const value = encodeURIComponent(String(mockArgs._id));
      expectedPath = expectedPath.replace("{" + "_id" + "}", value);
      expectedPath = expectedPath.replace("_id", value);
    }
    if (mockArgs.agent !== undefined) {
      const value = encodeURIComponent(String(mockArgs.agent));
      expectedPath = expectedPath.replace("{" + "agent" + "}", value);
      expectedPath = expectedPath.replace("agent", value);
    }

    expect(rcClient.request).toHaveBeenCalledWith(
      "POST",
      expectedPath,
      { body: mockArgs }
    );
  });
});
