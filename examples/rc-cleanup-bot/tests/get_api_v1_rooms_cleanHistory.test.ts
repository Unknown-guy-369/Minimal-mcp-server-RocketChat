import { describe, it, expect, vi, beforeEach } from "vitest";
import { tool } from "../src/tools/get_api_v1_rooms_cleanHistory.js";
import { rcClient } from "../src/rc-client.js";

describe("Tool: get_api_v1_rooms_cleanHistory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports correct name and description", () => {
    expect(tool.name).toBe("get_api_v1_rooms_cleanHistory");
    expect(tool.description).toBe("rooms.cleanHistory(rid:o, latest:o, oldest:o, [inclusive:o], [excludePinned:o], [filesOnly:o], [users:o], [limit:o], [ignoreDiscussion:o], [ignoreThreads:o])");
  });

  it("validates input schema with valid arguments", () => {
    const validArgs = {
      roomId: "test_string",
      latest: "test_string",
      oldest: "test_string",
      inclusive: true,
      excludePinned: true,
      filesOnly: true,
      users: [],
      limit: 123,
      ignoreDiscussion: true,
      ignoreThreads: true,
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
      latest: "test_string",
      oldest: "test_string",
      inclusive: true,
      excludePinned: true,
      filesOnly: true,
      users: [],
      limit: 123,
      ignoreDiscussion: true,
      ignoreThreads: true,
    };

    await tool.handler(mockArgs);

    expect(rcClient.request).toHaveBeenCalledTimes(1);
    
    // Validate request routing
    let expectedPath = "/api/v1/rooms.cleanHistory";
    if (mockArgs.roomId !== undefined) {
      const value = encodeURIComponent(String(mockArgs.roomId));
      expectedPath = expectedPath.replace("{" + "roomId" + "}", value);
      expectedPath = expectedPath.replace("roomId", value);
    }
    if (mockArgs.latest !== undefined) {
      const value = encodeURIComponent(String(mockArgs.latest));
      expectedPath = expectedPath.replace("{" + "latest" + "}", value);
      expectedPath = expectedPath.replace("latest", value);
    }
    if (mockArgs.oldest !== undefined) {
      const value = encodeURIComponent(String(mockArgs.oldest));
      expectedPath = expectedPath.replace("{" + "oldest" + "}", value);
      expectedPath = expectedPath.replace("oldest", value);
    }
    if (mockArgs.inclusive !== undefined) {
      const value = encodeURIComponent(String(mockArgs.inclusive));
      expectedPath = expectedPath.replace("{" + "inclusive" + "}", value);
      expectedPath = expectedPath.replace("inclusive", value);
    }
    if (mockArgs.excludePinned !== undefined) {
      const value = encodeURIComponent(String(mockArgs.excludePinned));
      expectedPath = expectedPath.replace("{" + "excludePinned" + "}", value);
      expectedPath = expectedPath.replace("excludePinned", value);
    }
    if (mockArgs.filesOnly !== undefined) {
      const value = encodeURIComponent(String(mockArgs.filesOnly));
      expectedPath = expectedPath.replace("{" + "filesOnly" + "}", value);
      expectedPath = expectedPath.replace("filesOnly", value);
    }
    if (mockArgs.users !== undefined) {
      const value = encodeURIComponent(String(mockArgs.users));
      expectedPath = expectedPath.replace("{" + "users" + "}", value);
      expectedPath = expectedPath.replace("users", value);
    }
    if (mockArgs.limit !== undefined) {
      const value = encodeURIComponent(String(mockArgs.limit));
      expectedPath = expectedPath.replace("{" + "limit" + "}", value);
      expectedPath = expectedPath.replace("limit", value);
    }
    if (mockArgs.ignoreDiscussion !== undefined) {
      const value = encodeURIComponent(String(mockArgs.ignoreDiscussion));
      expectedPath = expectedPath.replace("{" + "ignoreDiscussion" + "}", value);
      expectedPath = expectedPath.replace("ignoreDiscussion", value);
    }
    if (mockArgs.ignoreThreads !== undefined) {
      const value = encodeURIComponent(String(mockArgs.ignoreThreads));
      expectedPath = expectedPath.replace("{" + "ignoreThreads" + "}", value);
      expectedPath = expectedPath.replace("ignoreThreads", value);
    }

    expect(rcClient.request).toHaveBeenCalledWith(
      "POST",
      expectedPath,
      { body: mockArgs }
    );
  });
});
