import { describe, it, expect, vi, beforeEach } from "vitest";
import { tool } from "../src/tools/post_api_v1_integrations_create.js";
import { rcClient } from "../src/rc-client.js";

describe("Tool: post_api_v1_integrations_create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports correct name and description", () => {
    expect(tool.name).toBe("post_api_v1_integrations_create");
    expect(tool.description).toBe("integrations.new(type:o, u:o, channel:o, scriptEnabled:o, [script:o], name:o, enabled:o, [alias:o], [avatar:o], [emoji:o], event:o, urls:o, [triggerWords:o], [token:o])");
  });

  it("validates input schema with valid arguments", () => {
    const validArgs = {
      type: "test_string",
      username: "test_string",
      channel: "test_string",
      scriptEnabled: true,
      script: "test_string",
      name: "test_string",
      enabled: true,
      alias: "test_string",
      avatar: "test_string",
      emoji: "test_string",
      event: "test_string",
      urls: [],
      triggerWords: "test_string",
      token: "test_string",
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
      type: "test_string",
      username: "test_string",
      channel: "test_string",
      scriptEnabled: true,
      script: "test_string",
      name: "test_string",
      enabled: true,
      alias: "test_string",
      avatar: "test_string",
      emoji: "test_string",
      event: "test_string",
      urls: [],
      triggerWords: "test_string",
      token: "test_string",
    };

    await tool.handler(mockArgs);

    expect(rcClient.request).toHaveBeenCalledTimes(1);
    
    // Validate request routing
    let expectedPath = "/api/v1/integrations.create";
    if (mockArgs.type !== undefined) {
      const value = encodeURIComponent(String(mockArgs.type));
      expectedPath = expectedPath.replace("{" + "type" + "}", value);
      expectedPath = expectedPath.replace("type", value);
    }
    if (mockArgs.username !== undefined) {
      const value = encodeURIComponent(String(mockArgs.username));
      expectedPath = expectedPath.replace("{" + "username" + "}", value);
      expectedPath = expectedPath.replace("username", value);
    }
    if (mockArgs.channel !== undefined) {
      const value = encodeURIComponent(String(mockArgs.channel));
      expectedPath = expectedPath.replace("{" + "channel" + "}", value);
      expectedPath = expectedPath.replace("channel", value);
    }
    if (mockArgs.scriptEnabled !== undefined) {
      const value = encodeURIComponent(String(mockArgs.scriptEnabled));
      expectedPath = expectedPath.replace("{" + "scriptEnabled" + "}", value);
      expectedPath = expectedPath.replace("scriptEnabled", value);
    }
    if (mockArgs.script !== undefined) {
      const value = encodeURIComponent(String(mockArgs.script));
      expectedPath = expectedPath.replace("{" + "script" + "}", value);
      expectedPath = expectedPath.replace("script", value);
    }
    if (mockArgs.name !== undefined) {
      const value = encodeURIComponent(String(mockArgs.name));
      expectedPath = expectedPath.replace("{" + "name" + "}", value);
      expectedPath = expectedPath.replace("name", value);
    }
    if (mockArgs.enabled !== undefined) {
      const value = encodeURIComponent(String(mockArgs.enabled));
      expectedPath = expectedPath.replace("{" + "enabled" + "}", value);
      expectedPath = expectedPath.replace("enabled", value);
    }
    if (mockArgs.alias !== undefined) {
      const value = encodeURIComponent(String(mockArgs.alias));
      expectedPath = expectedPath.replace("{" + "alias" + "}", value);
      expectedPath = expectedPath.replace("alias", value);
    }
    if (mockArgs.avatar !== undefined) {
      const value = encodeURIComponent(String(mockArgs.avatar));
      expectedPath = expectedPath.replace("{" + "avatar" + "}", value);
      expectedPath = expectedPath.replace("avatar", value);
    }
    if (mockArgs.emoji !== undefined) {
      const value = encodeURIComponent(String(mockArgs.emoji));
      expectedPath = expectedPath.replace("{" + "emoji" + "}", value);
      expectedPath = expectedPath.replace("emoji", value);
    }
    if (mockArgs.event !== undefined) {
      const value = encodeURIComponent(String(mockArgs.event));
      expectedPath = expectedPath.replace("{" + "event" + "}", value);
      expectedPath = expectedPath.replace("event", value);
    }
    if (mockArgs.urls !== undefined) {
      const value = encodeURIComponent(String(mockArgs.urls));
      expectedPath = expectedPath.replace("{" + "urls" + "}", value);
      expectedPath = expectedPath.replace("urls", value);
    }
    if (mockArgs.triggerWords !== undefined) {
      const value = encodeURIComponent(String(mockArgs.triggerWords));
      expectedPath = expectedPath.replace("{" + "triggerWords" + "}", value);
      expectedPath = expectedPath.replace("triggerWords", value);
    }
    if (mockArgs.token !== undefined) {
      const value = encodeURIComponent(String(mockArgs.token));
      expectedPath = expectedPath.replace("{" + "token" + "}", value);
      expectedPath = expectedPath.replace("token", value);
    }

    expect(rcClient.request).toHaveBeenCalledWith(
      "POST",
      expectedPath,
      { body: mockArgs }
    );
  });
});
