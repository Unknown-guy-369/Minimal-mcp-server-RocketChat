import { describe, it, expect, vi, beforeEach } from "vitest";
import { tool } from "../src/tools/delete_api_apps_appId.js";
import { rcClient } from "../src/rc-client.js";

describe("Tool: delete_api_apps_appId", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports correct name and description", () => {
    expect(tool.name).toBe("delete_api_apps_appId");
    expect(tool.description).toBe("/api/apps/{appId}()");
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
    let expectedPath = "/api/apps/{appId}";

    expect(rcClient.request).toHaveBeenCalledWith(
      "DELETE",
      expectedPath,
      { body: mockArgs }
    );
  });
});
