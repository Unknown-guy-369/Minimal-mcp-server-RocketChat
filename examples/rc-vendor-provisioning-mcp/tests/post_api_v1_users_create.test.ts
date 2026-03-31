import { describe, it, expect, vi, beforeEach } from "vitest";
import { tool } from "../src/tools/post_api_v1_users_create.js";
import { rcClient } from "../src/rc-client.js";

describe("Tool: post_api_v1_users_create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports correct name and description", () => {
    expect(tool.name).toBe("post_api_v1_users_create");
    expect(tool.description).toBe("users.new(name:o, email:o, password:o, u:o, [active:o], [nickname:o], [bio:o], [joinDefaultChannels:o], [statusText:o], [roles:o], [requirePasswordChange:o], [setRandomPassword:o], [sendWelcomeEmail:o], [verified:o], [customFields:o])");
  });

  it("validates input schema with valid arguments", () => {
    const validArgs = {
      name: "test_string",
      email: "test_string",
      password: "test_string",
      username: "test_string",
      active: true,
      nickname: "test_string",
      bio: "test_string",
      joinDefaultChannels: true,
      statusText: "test_string",
      roles: [],
      requirePasswordChange: true,
      setRandomPassword: true,
      sendWelcomeEmail: true,
      verified: true,
      customFields: "test_string",
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
      name: "test_string",
      email: "test_string",
      password: "test_string",
      username: "test_string",
      active: true,
      nickname: "test_string",
      bio: "test_string",
      joinDefaultChannels: true,
      statusText: "test_string",
      roles: [],
      requirePasswordChange: true,
      setRandomPassword: true,
      sendWelcomeEmail: true,
      verified: true,
      customFields: "test_string",
    };

    await tool.handler(mockArgs);

    expect(rcClient.request).toHaveBeenCalledTimes(1);
    
    // Validate request routing
    let expectedPath = "/api/v1/users.create";
    if (mockArgs.name !== undefined) {
      const value = encodeURIComponent(String(mockArgs.name));
      expectedPath = expectedPath.replace("{" + "name" + "}", value);
      expectedPath = expectedPath.replace("name", value);
    }
    if (mockArgs.email !== undefined) {
      const value = encodeURIComponent(String(mockArgs.email));
      expectedPath = expectedPath.replace("{" + "email" + "}", value);
      expectedPath = expectedPath.replace("email", value);
    }
    if (mockArgs.password !== undefined) {
      const value = encodeURIComponent(String(mockArgs.password));
      expectedPath = expectedPath.replace("{" + "password" + "}", value);
      expectedPath = expectedPath.replace("password", value);
    }
    if (mockArgs.username !== undefined) {
      const value = encodeURIComponent(String(mockArgs.username));
      expectedPath = expectedPath.replace("{" + "username" + "}", value);
      expectedPath = expectedPath.replace("username", value);
    }
    if (mockArgs.active !== undefined) {
      const value = encodeURIComponent(String(mockArgs.active));
      expectedPath = expectedPath.replace("{" + "active" + "}", value);
      expectedPath = expectedPath.replace("active", value);
    }
    if (mockArgs.nickname !== undefined) {
      const value = encodeURIComponent(String(mockArgs.nickname));
      expectedPath = expectedPath.replace("{" + "nickname" + "}", value);
      expectedPath = expectedPath.replace("nickname", value);
    }
    if (mockArgs.bio !== undefined) {
      const value = encodeURIComponent(String(mockArgs.bio));
      expectedPath = expectedPath.replace("{" + "bio" + "}", value);
      expectedPath = expectedPath.replace("bio", value);
    }
    if (mockArgs.joinDefaultChannels !== undefined) {
      const value = encodeURIComponent(String(mockArgs.joinDefaultChannels));
      expectedPath = expectedPath.replace("{" + "joinDefaultChannels" + "}", value);
      expectedPath = expectedPath.replace("joinDefaultChannels", value);
    }
    if (mockArgs.statusText !== undefined) {
      const value = encodeURIComponent(String(mockArgs.statusText));
      expectedPath = expectedPath.replace("{" + "statusText" + "}", value);
      expectedPath = expectedPath.replace("statusText", value);
    }
    if (mockArgs.roles !== undefined) {
      const value = encodeURIComponent(String(mockArgs.roles));
      expectedPath = expectedPath.replace("{" + "roles" + "}", value);
      expectedPath = expectedPath.replace("roles", value);
    }
    if (mockArgs.requirePasswordChange !== undefined) {
      const value = encodeURIComponent(String(mockArgs.requirePasswordChange));
      expectedPath = expectedPath.replace("{" + "requirePasswordChange" + "}", value);
      expectedPath = expectedPath.replace("requirePasswordChange", value);
    }
    if (mockArgs.setRandomPassword !== undefined) {
      const value = encodeURIComponent(String(mockArgs.setRandomPassword));
      expectedPath = expectedPath.replace("{" + "setRandomPassword" + "}", value);
      expectedPath = expectedPath.replace("setRandomPassword", value);
    }
    if (mockArgs.sendWelcomeEmail !== undefined) {
      const value = encodeURIComponent(String(mockArgs.sendWelcomeEmail));
      expectedPath = expectedPath.replace("{" + "sendWelcomeEmail" + "}", value);
      expectedPath = expectedPath.replace("sendWelcomeEmail", value);
    }
    if (mockArgs.verified !== undefined) {
      const value = encodeURIComponent(String(mockArgs.verified));
      expectedPath = expectedPath.replace("{" + "verified" + "}", value);
      expectedPath = expectedPath.replace("verified", value);
    }
    if (mockArgs.customFields !== undefined) {
      const value = encodeURIComponent(String(mockArgs.customFields));
      expectedPath = expectedPath.replace("{" + "customFields" + "}", value);
      expectedPath = expectedPath.replace("customFields", value);
    }

    expect(rcClient.request).toHaveBeenCalledWith(
      "POST",
      expectedPath,
      { body: mockArgs }
    );
  });
});
