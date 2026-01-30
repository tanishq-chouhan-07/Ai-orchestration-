import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { hasRole } from "@/lib/rbac";
import { enforceGlobalAndUserRateLimit } from "@/lib/rate-limit";
import Instance from "@/models/Instance";
import RetentionPolicy from "@/models/RetentionPolicy";
import { writeAuditLog } from "@/services/audit";

const updateSchema = z.object({
  retentionDays: z.number().int().min(1).max(365),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
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

  await connectToDatabase();
  const policy = await RetentionPolicy.findById(id);
  if (!policy) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const instance = await Instance.findOne({ _id: policy.instanceId, userId });
  if (!instance) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    id: policy._id.toString(),
    instanceId: policy.instanceId.toString(),
    workflowId: policy.workflowId ?? null,
    retentionDays: policy.retentionDays,
    createdAt: policy.createdAt,
    updatedAt: policy.updatedAt,
  });
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
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
    const payload = updateSchema.parse(body);

    await connectToDatabase();
    const policy = await RetentionPolicy.findById(id);
    if (!policy) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const instance = await Instance.findOne({ _id: policy.instanceId, userId });
    if (!instance) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    policy.retentionDays = payload.retentionDays;
    await policy.save();

    await writeAuditLog({
      userId,
      action: "retention.update",
      resource: policy._id.toString(),
      metadata: { retentionDays: payload.retentionDays },
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
    return NextResponse.json({ error: "Failed to update retention policy" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
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

  await connectToDatabase();
  const policy = await RetentionPolicy.findById(id);
  if (!policy) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const instance = await Instance.findOne({ _id: policy.instanceId, userId });
  if (!instance) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await RetentionPolicy.deleteOne({ _id: policy._id });

  await writeAuditLog({
    userId,
    action: "retention.delete",
    resource: policy._id.toString(),
  });

  return NextResponse.json({ success: true });
}
