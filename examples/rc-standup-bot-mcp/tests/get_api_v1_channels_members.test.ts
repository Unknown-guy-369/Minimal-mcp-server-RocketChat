import { describe, it, expect, vi, beforeEach } from "vitest";
import { tool } from "../src/tools/get_api_v1_channels_members.js";
import { rcClient } from "../src/rc-client.js";

describe("Tool: get_api_v1_channels_members", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports correct name and description", () => {
    expect(tool.name).toBe("get_api_v1_channels_members");
    expect(tool.description).toBe("channels.members()");
  });

  it("validates input schema with valid arguments", () => {
    const validArgs = {
    };
    
    const result = tool.inputSchema.safeParse(validArgs);
    expect(result.success).toBe(true);
  });


  it("calls rcClient.request with correct method, path, and payload", async () => {
    const mockArgs = {
    };

    await tool.handler(mockArgs);

    expect(rcClient.request).toHaveBeenCalledTimes(1);
    
    // Validate request routing
    let expectedPath = "/api/v1/channels.members";

    expect(rcClient.request).toHaveBeenCalledWith(
      "GET",
      expectedPath,
      { body: mockArgs }
    );
  });
});
