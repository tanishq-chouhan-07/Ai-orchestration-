import { z } from "zod";

const dateValue = z.union([z.string(), z.null()]);

export const instanceSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().url(),
  isActive: z.boolean(),
  lastHealthCheck: dateValue.optional(),
  healthStatus: z.string().optional(),
  createdAt: dateValue.optional(),
  updatedAt: dateValue.optional(),
});

export const instancesResponseSchema = z.object({
  data: z.array(instanceSchema),
});

export const retentionPolicySchema = z.object({
  id: z.string(),
  instanceId: z.string(),
  workflowId: z.string().nullable(),
  retentionDays: z.number().int(),
  createdAt: dateValue.optional(),
  updatedAt: dateValue.optional(),
});

export const retentionPoliciesResponseSchema = z.object({
  data: z.array(retentionPolicySchema),
});
