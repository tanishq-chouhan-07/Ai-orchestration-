import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { encryptString } from "@/lib/encryption";
import { enforceGlobalAndUserRateLimit } from "@/lib/rate-limit";
import Instance from "@/models/Instance";
import { writeAuditLog } from "@/services/audit";

const updateInstanceSchema = z.object({
  name: z.string().min(1).optional(),
  url: z.string().url().optional(),
  apiKey: z.string().min(1).optional(),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user || !(session.user as { id?: string }).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const rateLimitResponse = enforceGlobalAndUserRateLimit(userId);
  if (rateLimitResponse) return rateLimitResponse;

  const { id } = await context.params;
  await connectToDatabase();
  const instance = await Instance.findOne({ _id: id, userId });
  if (!instance) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await writeAuditLog({
    userId,
    action: "instances.get",
    resource: instance._id.toString(),
  });

  return NextResponse.json({
    id: instance._id.toString(),
    name: instance.name,
    url: instance.url,
    isActive: instance.isActive,
    lastHealthCheck: instance.lastHealthCheck,
    healthStatus: instance.healthStatus,
    createdAt: instance.createdAt,
    updatedAt: instance.updatedAt,
  });
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user || !(session.user as { id?: string }).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const rateLimitResponse = enforceGlobalAndUserRateLimit(userId);
    if (rateLimitResponse) return rateLimitResponse;

    const body = await request.json();
    const payload = updateInstanceSchema.parse(body);

    const { id } = await context.params;
    await connectToDatabase();

    const update: Record<string, unknown> = {};
    if (payload.name) update.name = payload.name;
    if (payload.url) update.url = payload.url;
    if (payload.apiKey) update.encryptedApiKey = encryptString(payload.apiKey);

    const instance = await Instance.findOneAndUpdate(
      { _id: id, userId },
      update,
      { new: true }
    );

    if (!instance) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await writeAuditLog({
      userId,
      action: "instances.update",
      resource: instance._id.toString(),
      metadata: { fields: Object.keys(update) },
    });

    return NextResponse.json({
      id: instance._id.toString(),
      name: instance.name,
      url: instance.url,
      isActive: instance.isActive,
      lastHealthCheck: instance.lastHealthCheck,
      healthStatus: instance.healthStatus,
      createdAt: instance.createdAt,
      updatedAt: instance.updatedAt,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid payload", issues: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update instance" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user || !(session.user as { id?: string }).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const rateLimitResponse = enforceGlobalAndUserRateLimit(userId);
  if (rateLimitResponse) return rateLimitResponse;

  const { id } = await context.params;
  await connectToDatabase();
  const deleted = await Instance.findOneAndDelete({ _id: id, userId });
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await writeAuditLog({
    userId,
    action: "instances.delete",
    resource: deleted._id.toString(),
  });

  return NextResponse.json({ success: true });
}
