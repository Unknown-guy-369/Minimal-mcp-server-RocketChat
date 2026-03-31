import { describe, it, expect, vi, beforeEach } from "vitest";
import { tool } from "../src/tools/post_api_v1_groups_setAnnouncement.js";
import { rcClient } from "../src/rc-client.js";

describe("Tool: post_api_v1_groups_setAnnouncement", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports correct name and description", () => {
    expect(tool.name).toBe("post_api_v1_groups_setAnnouncement");
    expect(tool.description).toBe("groups.setAnn(rid:o, announcement:o)");
  });

  it("validates input schema with valid arguments", () => {
    const validArgs = {
      roomId: "test_string",
      announcement: "test_string",
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
      announcement: "test_string",
    };

    await tool.handler(mockArgs);

    expect(rcClient.request).toHaveBeenCalledTimes(1);
    
    // Validate request routing
    let expectedPath = "/api/v1/groups.setAnnouncement";
    if (mockArgs.roomId !== undefined) {
      const value = encodeURIComponent(String(mockArgs.roomId));
      expectedPath = expectedPath.replace("{" + "roomId" + "}", value);
      expectedPath = expectedPath.replace("roomId", value);
    }
    if (mockArgs.announcement !== undefined) {
      const value = encodeURIComponent(String(mockArgs.announcement));
      expectedPath = expectedPath.replace("{" + "announcement" + "}", value);
      expectedPath = expectedPath.replace("announcement", value);
    }

    expect(rcClient.request).toHaveBeenCalledWith(
      "POST",
      expectedPath,
      { body: mockArgs }
    );
  });
});
