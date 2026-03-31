import { describe, it, expect, vi, beforeEach } from "vitest";
import { tool } from "../src/tools/post_api_v1_livechat_room_forward.js";
import { rcClient } from "../src/rc-client.js";

describe("Tool: post_api_v1_livechat_room_forward", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports correct name and description", () => {
    expect(tool.name).toBe("post_api_v1_livechat_room_forward");
    expect(tool.description).toBe("livechat/room.forward(rid:o, [uid:o], [departmentId:o])");
  });

  it("validates input schema with valid arguments", () => {
    const validArgs = {
      roomId: "test_string",
      userId: "test_string",
      departmentId: "test_string",
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
      userId: "test_string",
      departmentId: "test_string",
    };

    await tool.handler(mockArgs);

    expect(rcClient.request).toHaveBeenCalledTimes(1);
    
    // Validate request routing
    let expectedPath = "/api/v1/livechat/room.forward";
    if (mockArgs.roomId !== undefined) {
      const value = encodeURIComponent(String(mockArgs.roomId));
      expectedPath = expectedPath.replace("{" + "roomId" + "}", value);
      expectedPath = expectedPath.replace("roomId", value);
    }
    if (mockArgs.userId !== undefined) {
      const value = encodeURIComponent(String(mockArgs.userId));
      expectedPath = expectedPath.replace("{" + "userId" + "}", value);
      expectedPath = expectedPath.replace("userId", value);
    }
    if (mockArgs.departmentId !== undefined) {
      const value = encodeURIComponent(String(mockArgs.departmentId));
      expectedPath = expectedPath.replace("{" + "departmentId" + "}", value);
      expectedPath = expectedPath.replace("departmentId", value);
    }

    expect(rcClient.request).toHaveBeenCalledWith(
      "POST",
      expectedPath,
      { body: mockArgs }
    );
  });
});
