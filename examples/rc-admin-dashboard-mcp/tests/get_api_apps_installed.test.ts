import { describe, it, expect, vi, beforeEach } from "vitest";
import { tool } from "../src/tools/get_api_apps_installed.js";
import { rcClient } from "../src/rc-client.js";

describe("Tool: get_api_apps_installed", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports correct name and description", () => {
    expect(tool.name).toBe("get_api_apps_installed");
    expect(tool.description).toBe("/api/apps/installed()");
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
    let expectedPath = "/api/apps/installed";

    expect(rcClient.request).toHaveBeenCalledWith(
      "GET",
      expectedPath,
      { body: mockArgs }
    );
  });
});
