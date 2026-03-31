import { describe, it, expect, vi, beforeEach } from "vitest";
import { tool } from "../src/tools/post_api_v1_roles_addUserToRole.js";
import { rcClient } from "../src/rc-client.js";

describe("Tool: post_api_v1_roles_addUserToRole", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports correct name and description", () => {
    expect(tool.name).toBe("post_api_v1_roles_addUserToRole");
    expect(tool.description).toBe("roles.addUserToRole([roleId:o], u:o, [rid:o])");
  });

  it("validates input schema with valid arguments", () => {
    const validArgs = {
      roleId: "test_string",
      username: "test_string",
      roomId: "test_string",
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
      roleId: "test_string",
      username: "test_string",
      roomId: "test_string",
    };

    await tool.handler(mockArgs);

    expect(rcClient.request).toHaveBeenCalledTimes(1);
    
    // Validate request routing
    let expectedPath = "/api/v1/roles.addUserToRole";
    if (mockArgs.roleId !== undefined) {
      const value = encodeURIComponent(String(mockArgs.roleId));
      expectedPath = expectedPath.replace("{" + "roleId" + "}", value);
      expectedPath = expectedPath.replace("roleId", value);
    }
    if (mockArgs.username !== undefined) {
      const value = encodeURIComponent(String(mockArgs.username));
      expectedPath = expectedPath.replace("{" + "username" + "}", value);
      expectedPath = expectedPath.replace("username", value);
    }
    if (mockArgs.roomId !== undefined) {
      const value = encodeURIComponent(String(mockArgs.roomId));
      expectedPath = expectedPath.replace("{" + "roomId" + "}", value);
      expectedPath = expectedPath.replace("roomId", value);
    }

    expect(rcClient.request).toHaveBeenCalledWith(
      "POST",
      expectedPath,
      { body: mockArgs }
    );
  });
});
