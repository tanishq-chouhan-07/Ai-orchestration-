import { describe, expect, it, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/proxy/workflows/route";

const mockAuth = vi.fn();
const mockConnect = vi.fn();
const mockFindOne = vi.fn();
const mockDecrypt = vi.fn();
const mockFetchWorkflows = vi.fn();
const mockRateLimit = vi.fn();

vi.mock("@/lib/auth", () => ({ auth: () => mockAuth() }));
vi.mock("@/lib/db", () => ({ connectToDatabase: () => mockConnect() }));
vi.mock("@/lib/encryption", () => ({ decryptString: (value: string) => mockDecrypt(value) }));
vi.mock("@/lib/rate-limit", () => ({ enforceGlobalAndUserRateLimit: () => mockRateLimit() }));
vi.mock("@/models/Instance", () => ({
  default: {
    findOne: (...args: unknown[]) => mockFindOne(...args),
  },
}));
vi.mock("@/services/n8n", () => ({
  fetchWorkflows: (...args: unknown[]) => mockFetchWorkflows(...args),
  N8nError: class extends Error {
    status = 500;
    body = "error";
    rateLimit = undefined;
  },
}));

beforeEach(() => {
  mockAuth.mockReset();
  mockConnect.mockReset();
  mockFindOne.mockReset();
  mockDecrypt.mockReset();
  mockFetchWorkflows.mockReset();
  mockRateLimit.mockReset();
});

describe("GET /api/proxy/workflows", () => {
  it("returns 400 when instanceId is missing", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1", role: "viewer" } });
    mockRateLimit.mockReturnValue(null);

    const response = await GET(new Request("http://localhost/api/proxy/workflows"));
    expect(response.status).toBe(400);
  });

  it("returns workflow data for valid request", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1", role: "viewer" } });
    mockRateLimit.mockReturnValue(null);
    mockFindOne.mockResolvedValue({
      _id: "instance-1",
      userId: "user-1",
      url: "https://n8n.example.com",
      encryptedApiKey: "encrypted",
    });
    mockDecrypt.mockReturnValue("api-key");
    mockFetchWorkflows.mockResolvedValue([{ id: "workflow-1" }]);

    const response = await GET(
      new Request("http://localhost/api/proxy/workflows?instanceId=instance-1")
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toEqual([{ id: "workflow-1" }]);
  });
});
