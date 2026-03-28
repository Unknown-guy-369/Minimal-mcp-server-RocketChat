import { describe, it, expect, vi, beforeEach } from "vitest";
import { tool } from "../src/tools/get_api_v1_engagement_dashboard_users_active_users.js";
import { rcClient } from "../src/rc-client.js";

describe("Tool: get_api_v1_engagement_dashboard_users_active_users", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports correct name and description", () => {
    expect(tool.name).toBe("get_api_v1_engagement_dashboard_users_active_users");
    expect(tool.description).toBe("engagement-dashboard/users/active-users()");
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
    let expectedPath = "/api/v1/engagement-dashboard/users/active-users";

    expect(rcClient.request).toHaveBeenCalledWith(
      "GET",
      expectedPath,
      { body: mockArgs }
    );
  });
});
