import { describe, it, expect, vi, beforeEach } from "vitest";
import { tool } from "../src/tools/post_api_v1_rooms_export.js";
import { rcClient } from "../src/rc-client.js";

describe("Tool: post_api_v1_rooms_export", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports correct name and description", () => {
    expect(tool.name).toBe("post_api_v1_rooms_export");
    expect(tool.description).toBe("rooms.export(rid:o, type:o, [dateFrom:o], [dateTo:o], [format:o], [toUsers:o], [toEmails:o], [messages:o], [subject:o])");
  });

  it("validates input schema with valid arguments", () => {
    const validArgs = {
      rid: "test_string",
      type: "test_string",
      dateFrom: "test_string",
      dateTo: "test_string",
      format: "test_string",
      toUsers: [],
      toEmails: [],
      messages: [],
      subject: "test_string",
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
      rid: "test_string",
      type: "test_string",
      dateFrom: "test_string",
      dateTo: "test_string",
      format: "test_string",
      toUsers: [],
      toEmails: [],
      messages: [],
      subject: "test_string",
    };

    await tool.handler(mockArgs);

    expect(rcClient.request).toHaveBeenCalledTimes(1);
    
    // Validate request routing
    let expectedPath = "/api/v1/rooms.export";
    if (mockArgs.rid !== undefined) {
      const value = encodeURIComponent(String(mockArgs.rid));
      expectedPath = expectedPath.replace("{" + "rid" + "}", value);
      expectedPath = expectedPath.replace("rid", value);
    }
    if (mockArgs.type !== undefined) {
      const value = encodeURIComponent(String(mockArgs.type));
      expectedPath = expectedPath.replace("{" + "type" + "}", value);
      expectedPath = expectedPath.replace("type", value);
    }
    if (mockArgs.dateFrom !== undefined) {
      const value = encodeURIComponent(String(mockArgs.dateFrom));
      expectedPath = expectedPath.replace("{" + "dateFrom" + "}", value);
      expectedPath = expectedPath.replace("dateFrom", value);
    }
    if (mockArgs.dateTo !== undefined) {
      const value = encodeURIComponent(String(mockArgs.dateTo));
      expectedPath = expectedPath.replace("{" + "dateTo" + "}", value);
      expectedPath = expectedPath.replace("dateTo", value);
    }
    if (mockArgs.format !== undefined) {
      const value = encodeURIComponent(String(mockArgs.format));
      expectedPath = expectedPath.replace("{" + "format" + "}", value);
      expectedPath = expectedPath.replace("format", value);
    }
    if (mockArgs.toUsers !== undefined) {
      const value = encodeURIComponent(String(mockArgs.toUsers));
      expectedPath = expectedPath.replace("{" + "toUsers" + "}", value);
      expectedPath = expectedPath.replace("toUsers", value);
    }
    if (mockArgs.toEmails !== undefined) {
      const value = encodeURIComponent(String(mockArgs.toEmails));
      expectedPath = expectedPath.replace("{" + "toEmails" + "}", value);
      expectedPath = expectedPath.replace("toEmails", value);
    }
    if (mockArgs.messages !== undefined) {
      const value = encodeURIComponent(String(mockArgs.messages));
      expectedPath = expectedPath.replace("{" + "messages" + "}", value);
      expectedPath = expectedPath.replace("messages", value);
    }
    if (mockArgs.subject !== undefined) {
      const value = encodeURIComponent(String(mockArgs.subject));
      expectedPath = expectedPath.replace("{" + "subject" + "}", value);
      expectedPath = expectedPath.replace("subject", value);
    }

    expect(rcClient.request).toHaveBeenCalledWith(
      "POST",
      expectedPath,
      { body: mockArgs }
    );
  });
});
