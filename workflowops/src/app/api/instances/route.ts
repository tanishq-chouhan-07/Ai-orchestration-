import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { encryptString } from "@/lib/encryption";
import { enforceGlobalAndUserRateLimit } from "@/lib/rate-limit";
import Instance from "@/models/Instance";
import RetentionPolicy from "@/models/RetentionPolicy";
import { writeAuditLog } from "@/services/audit";

const createInstanceSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  apiKey: z.string().min(1),
});

export async function GET() {
  const session = await auth();
  if (!session?.user || !(session.user as { id?: string }).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const rateLimitResponse = enforceGlobalAndUserRateLimit(userId);
  if (rateLimitResponse) return rateLimitResponse;

  await connectToDatabase();
  const instances = await Instance.find({ userId }).sort({ createdAt: -1 });

  await writeAuditLog({
    userId,
    action: "instances.list",
    resource: "Instance",
  });

  return NextResponse.json({
    data: instances.map((instance) => ({
      id: instance._id.toString(),
      name: instance.name,
      url: instance.url,
      isActive: instance.isActive,
      lastHealthCheck: instance.lastHealthCheck,
      healthStatus: instance.healthStatus,
      createdAt: instance.createdAt,
      updatedAt: instance.updatedAt,
    })),
  });
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || !(session.user as { id?: string }).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const rateLimitResponse = enforceGlobalAndUserRateLimit(userId);
    if (rateLimitResponse) return rateLimitResponse;

    const body = await request.json();
    const payload = createInstanceSchema.parse(body);

    await connectToDatabase();

    const instance = await Instance.create({
      userId,
      name: payload.name,
      url: payload.url,
      encryptedApiKey: encryptString(payload.apiKey),
    });

    await RetentionPolicy.create({
      instanceId: instance._id,
      retentionDays: 30,
    });

    await writeAuditLog({
      userId,
      action: "instances.create",
      resource: instance._id.toString(),
      metadata: { name: instance.name },
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
    return NextResponse.json({ error: "Failed to create instance" }, { status: 500 });
  }
}
