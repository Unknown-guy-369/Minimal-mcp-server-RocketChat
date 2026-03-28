import { describe, it, expect, vi, beforeEach } from "vitest";
import { tool } from "../src/tools/test_tool.js";
import { rcClient } from "../src/rc-client.js";

describe("Tool: test_tool", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports correct name and description", () => {
    expect(tool.name).toBe("test_tool");
    expect(tool.description).toBe("test.tool()");
  });

  it("validates input schema with valid arguments", () => {
    const validArgs = {
      userId: "test_string",
      count: 123,
      tags: [],
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
      userId: "test_string",
      count: 123,
      tags: [],
    };

    await tool.handler(mockArgs);

    expect(rcClient.request).toHaveBeenCalledTimes(1);
    
    // Validate request routing
    let expectedPath = "/api/v1/test";
    if (mockArgs.userId !== undefined) {
      const value = encodeURIComponent(String(mockArgs.userId));
      expectedPath = expectedPath.replace("{" + "userId" + "}", value);
      expectedPath = expectedPath.replace("userId", value);
    }
    if (mockArgs.count !== undefined) {
      const value = encodeURIComponent(String(mockArgs.count));
      expectedPath = expectedPath.replace("{" + "count" + "}", value);
      expectedPath = expectedPath.replace("count", value);
    }
    if (mockArgs.tags !== undefined) {
      const value = encodeURIComponent(String(mockArgs.tags));
      expectedPath = expectedPath.replace("{" + "tags" + "}", value);
      expectedPath = expectedPath.replace("tags", value);
    }

    expect(rcClient.request).toHaveBeenCalledWith(
      "POST",
      expectedPath,
      { body: mockArgs }
    );
  });
});
