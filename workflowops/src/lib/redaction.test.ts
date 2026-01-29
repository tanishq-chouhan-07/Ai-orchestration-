import { describe, expect, it } from "vitest";
import { redactObject } from "@/lib/redaction";

describe("redactObject", () => {
  it("redacts sensitive keys in nested objects", () => {
    const input = {
      password: "secret",
      profile: {
        token: "abc",
        nested: {
          apiKey: "value",
          ok: "keep",
        },
      },
    };

    const output = redactObject(input) as Record<string, unknown>;
    expect(output.password).toBe("[REDACTED]");
    expect((output.profile as Record<string, unknown>).token).toBe("[REDACTED]");
    expect(
      ((output.profile as Record<string, unknown>).nested as Record<string, unknown>).apiKey
    ).toBe("[REDACTED]");
    expect(
      ((output.profile as Record<string, unknown>).nested as Record<string, unknown>).ok
    ).toBe("keep");
  });

  it("redacts arrays of objects", () => {
    const input = [{ authorization: "Bearer token" }];
    const output = redactObject(input) as Array<Record<string, unknown>>;
    expect(output[0].authorization).toBe("[REDACTED]");
  });
});
