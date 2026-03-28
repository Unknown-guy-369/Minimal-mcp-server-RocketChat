import { describe, it, expect, vi, beforeEach } from "vitest";
import { tool } from "../src/tools/post_api_v1_groups_delete.js";
import { rcClient } from "../src/rc-client.js";

describe("Tool: post_api_v1_groups_delete", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports correct name and description", () => {
    expect(tool.name).toBe("post_api_v1_groups_delete");
    expect(tool.description).toBe("groups.del([rid:o], [roomName:o])");
  });

  it("validates input schema with valid arguments", () => {
    const validArgs = {
      roomId: "test_string",
      roomName: "test_string",
    };
    
    const result = tool.inputSchema.safeParse(validArgs);
    expect(result.success).toBe(true);
  });


  it("calls rcClient.request with correct method, path, and payload", async () => {
    const mockArgs = {
      roomId: "test_string",
      roomName: "test_string",
    };

    await tool.handler(mockArgs);

    expect(rcClient.request).toHaveBeenCalledTimes(1);
    
    // Validate request routing
    let expectedPath = "/api/v1/groups.delete";
    if (mockArgs.roomId !== undefined) {
      const value = encodeURIComponent(String(mockArgs.roomId));
      expectedPath = expectedPath.replace("{" + "roomId" + "}", value);
      expectedPath = expectedPath.replace("roomId", value);
    }
    if (mockArgs.roomName !== undefined) {
      const value = encodeURIComponent(String(mockArgs.roomName));
      expectedPath = expectedPath.replace("{" + "roomName" + "}", value);
      expectedPath = expectedPath.replace("roomName", value);
    }

    expect(rcClient.request).toHaveBeenCalledWith(
      "POST",
      expectedPath,
      { body: mockArgs }
    );
  });
});
