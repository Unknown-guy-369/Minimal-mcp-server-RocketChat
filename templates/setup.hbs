import { vi } from "vitest";

// Provide dummy environment variables for initAuth
process.env.ROCKETCHAT_URL = "http://localhost:3000";
process.env.ROCKETCHAT_USER_ID = "mock-user-id";
process.env.ROCKETCHAT_AUTH_TOKEN = "mock-auth-token";

// Mock the HTTP client globally so tests never hit the real API
vi.mock("../src/rc-client.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../src/rc-client.js")>();
  return {
    ...actual,
    rcClient: {
      request: vi.fn().mockResolvedValue({
        content: [{ type: "text", text: '{"success": true, "mocked": true}' }]
      })
    },
    initAuth: vi.fn().mockResolvedValue(undefined)
  };
});
