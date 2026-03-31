import { describe, it, expect, vi, beforeEach } from "vitest";
import { tool } from "../src/tools/post_api_v1_groups_create.js";
import { rcClient } from "../src/rc-client.js";

describe("Tool: post_api_v1_groups_create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports correct name and description", () => {
    expect(tool.name).toBe("post_api_v1_groups_create");
    expect(tool.description).toBe("groups.new(name:o, [readOnly:o], [members:o], [excludeSelf:o], [customFields:o], [extraData:o])");
  });

  it("validates input schema with valid arguments", () => {
    const validArgs = {
      name: "test_string",
      readOnly: true,
      members: [],
      excludeSelf: true,
      customFields: "test_string",
      extraData: "test_string",
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
      readOnly: true,
      members: [],
      excludeSelf: true,
      customFields: "test_string",
      extraData: "test_string",
    };

    await tool.handler(mockArgs);

    expect(rcClient.request).toHaveBeenCalledTimes(1);
    
    // Validate request routing
    let expectedPath = "/api/v1/groups.create";
    if (mockArgs.name !== undefined) {
      const value = encodeURIComponent(String(mockArgs.name));
      expectedPath = expectedPath.replace("{" + "name" + "}", value);
      expectedPath = expectedPath.replace("name", value);
    }
    if (mockArgs.readOnly !== undefined) {
      const value = encodeURIComponent(String(mockArgs.readOnly));
      expectedPath = expectedPath.replace("{" + "readOnly" + "}", value);
      expectedPath = expectedPath.replace("readOnly", value);
    }
    if (mockArgs.members !== undefined) {
      const value = encodeURIComponent(String(mockArgs.members));
      expectedPath = expectedPath.replace("{" + "members" + "}", value);
      expectedPath = expectedPath.replace("members", value);
    }
    if (mockArgs.excludeSelf !== undefined) {
      const value = encodeURIComponent(String(mockArgs.excludeSelf));
      expectedPath = expectedPath.replace("{" + "excludeSelf" + "}", value);
      expectedPath = expectedPath.replace("excludeSelf", value);
    }
    if (mockArgs.customFields !== undefined) {
      const value = encodeURIComponent(String(mockArgs.customFields));
      expectedPath = expectedPath.replace("{" + "customFields" + "}", value);
      expectedPath = expectedPath.replace("customFields", value);
    }
    if (mockArgs.extraData !== undefined) {
      const value = encodeURIComponent(String(mockArgs.extraData));
      expectedPath = expectedPath.replace("{" + "extraData" + "}", value);
      expectedPath = expectedPath.replace("extraData", value);
    }

    expect(rcClient.request).toHaveBeenCalledWith(
      "POST",
      expectedPath,
      { body: mockArgs }
    );
  });
});
