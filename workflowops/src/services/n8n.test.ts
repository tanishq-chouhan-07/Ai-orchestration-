import { describe, expect, it, vi, afterEach } from "vitest";
import { N8nError, fetchWorkflows } from "@/services/n8n";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("n8n service", () => {
  it("throws N8nError with rate limit info", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 429,
      text: async () => "Too Many Requests",
      headers: new Headers({ "retry-after": "30" }),
    } as Response);

    await expect(fetchWorkflows("https://n8n.example.com", "key")).rejects.toEqual(
      expect.objectContaining({
        status: 429,
        body: "Too Many Requests",
        rateLimit: { retryAfter: "30" },
      })
    );
  });

  it("returns data for ok responses", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => [{ id: "workflow-1" }],
    } as Response);

    const data = await fetchWorkflows("https://n8n.example.com", "key");
    expect(data).toEqual([{ id: "workflow-1" }]);
  });

  it("captures error text for non-rate limit errors", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => "Server error",
      headers: new Headers(),
    } as Response);

    try {
      await fetchWorkflows("https://n8n.example.com", "key");
    } catch (error) {
      const n8nError = error as N8nError;
      expect(n8nError.status).toBe(500);
      expect(n8nError.body).toBe("Server error");
      expect(n8nError.rateLimit).toBeUndefined();
    }
  });
});
