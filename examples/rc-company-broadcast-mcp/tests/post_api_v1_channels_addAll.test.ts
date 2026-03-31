import { describe, it, expect, vi, beforeEach } from "vitest";
import { tool } from "../src/tools/post_api_v1_channels_addAll.js";
import { rcClient } from "../src/rc-client.js";

describe("Tool: post_api_v1_channels_addAll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports correct name and description", () => {
    expect(tool.name).toBe("post_api_v1_channels_addAll");
    expect(tool.description).toBe("channels.addAll(rid:o, [activeUsersOnly:o])");
  });

  it("validates input schema with valid arguments", () => {
    const validArgs = {
      roomId: "test_string",
      activeUsersOnly: true,
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
      activeUsersOnly: true,
    };

    await tool.handler(mockArgs);

    expect(rcClient.request).toHaveBeenCalledTimes(1);
    
    // Validate request routing
    let expectedPath = "/api/v1/channels.addAll";
    if (mockArgs.roomId !== undefined) {
      const value = encodeURIComponent(String(mockArgs.roomId));
      expectedPath = expectedPath.replace("{" + "roomId" + "}", value);
      expectedPath = expectedPath.replace("roomId", value);
    }
    if (mockArgs.activeUsersOnly !== undefined) {
      const value = encodeURIComponent(String(mockArgs.activeUsersOnly));
      expectedPath = expectedPath.replace("{" + "activeUsersOnly" + "}", value);
      expectedPath = expectedPath.replace("activeUsersOnly", value);
    }

    expect(rcClient.request).toHaveBeenCalledWith(
      "POST",
      expectedPath,
      { body: mockArgs }
    );
  });
});
