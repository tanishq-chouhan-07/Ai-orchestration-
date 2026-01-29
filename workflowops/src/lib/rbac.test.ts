import { describe, expect, it } from "vitest";
import { hasRole } from "@/lib/rbac";

describe("hasRole", () => {
  it("permits higher roles", () => {
    expect(hasRole("admin", "viewer")).toBe(true);
    expect(hasRole("admin", "operator")).toBe(true);
  });

  it("permits equal roles", () => {
    expect(hasRole("operator", "operator")).toBe(true);
  });

  it("denies lower roles", () => {
    expect(hasRole("viewer", "admin")).toBe(false);
    expect(hasRole("viewer", "operator")).toBe(false);
  });
});
