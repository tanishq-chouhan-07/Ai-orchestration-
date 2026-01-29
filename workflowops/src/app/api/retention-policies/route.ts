import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { hasRole } from "@/lib/rbac";
import { enforceGlobalAndUserRateLimit } from "@/lib/rate-limit";
import Instance from "@/models/Instance";
import RetentionPolicy from "@/models/RetentionPolicy";
import { writeAuditLog } from "@/services/audit";

const createSchema = z.object({
  instanceId: z.string().min(1),
  workflowId: z.string().min(1).optional(),
  retentionDays: z.number().int().min(1).max(365),
});

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user || !(session.user as { id?: string; role?: string }).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as { role?: string }).role ?? "viewer";
  if (!hasRole(role as "viewer" | "operator" | "admin", "admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const userId = (session.user as { id: string }).id;
  const rateLimitResponse = enforceGlobalAndUserRateLimit(userId);
  if (rateLimitResponse) return rateLimitResponse;

  const { searchParams } = new URL(request.url);
  const instanceId = searchParams.get("instanceId") ?? undefined;
  const workflowId = searchParams.get("workflowId") ?? undefined;

  await connectToDatabase();
  const query: Record<string, unknown> = {};
  if (instanceId) {
    const instance = await Instance.findOne({ _id: instanceId, userId });
    if (!instance) {
      return NextResponse.json({ error: "Instance not found" }, { status: 404 });
    }
    query.instanceId = instanceId;
  }
  if (workflowId) query.workflowId = workflowId;

  const policies = await RetentionPolicy.find(query).sort({ createdAt: -1 });

  return NextResponse.json({
    data: policies.map((policy) => ({
      id: policy._id.toString(),
      instanceId: policy.instanceId.toString(),
      workflowId: policy.workflowId ?? null,
      retentionDays: policy.retentionDays,
      createdAt: policy.createdAt,
      updatedAt: policy.updatedAt,
    })),
  });
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || !(session.user as { id?: string; role?: string }).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role ?? "viewer";
    if (!hasRole(role as "viewer" | "operator" | "admin", "admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userId = (session.user as { id: string }).id;
    const rateLimitResponse = enforceGlobalAndUserRateLimit(userId);
    if (rateLimitResponse) return rateLimitResponse;

    const body = await request.json();
    const payload = createSchema.parse(body);

    await connectToDatabase();
    const instance = await Instance.findOne({ _id: payload.instanceId, userId });
    if (!instance) {
      return NextResponse.json({ error: "Instance not found" }, { status: 404 });
    }

    const policy = await RetentionPolicy.create({
      instanceId: payload.instanceId,
      workflowId: payload.workflowId,
      retentionDays: payload.retentionDays,
    });

    await writeAuditLog({
      userId,
      action: "retention.create",
      resource: policy._id.toString(),
      metadata: { instanceId: payload.instanceId, workflowId: payload.workflowId },
    });

    return NextResponse.json({
      id: policy._id.toString(),
      instanceId: policy.instanceId.toString(),
      workflowId: policy.workflowId ?? null,
      retentionDays: policy.retentionDays,
      createdAt: policy.createdAt,
      updatedAt: policy.updatedAt,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid payload", issues: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create retention policy" }, { status: 500 });
  }
}
