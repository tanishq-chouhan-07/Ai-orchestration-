import { describe, expect, it } from "vitest";
import {
  instancesResponseSchema,
  retentionPoliciesResponseSchema,
} from "@/lib/api-contracts";

describe("api contracts", () => {
  it("validates instance responses", () => {
    const payload = {
      data: [
        {
          id: "instance-1",
          name: "Primary",
          url: "https://n8n.example.com",
          isActive: true,
          lastHealthCheck: null,
          healthStatus: "healthy",
          createdAt: null,
          updatedAt: null,
        },
      ],
    };

    expect(() => instancesResponseSchema.parse(payload)).not.toThrow();
  });

  it("validates retention policy responses", () => {
    const payload = {
      data: [
        {
          id: "policy-1",
          instanceId: "instance-1",
          workflowId: null,
          retentionDays: 30,
          createdAt: null,
          updatedAt: null,
        },
      ],
    };

    expect(() => retentionPoliciesResponseSchema.parse(payload)).not.toThrow();
  });
});
