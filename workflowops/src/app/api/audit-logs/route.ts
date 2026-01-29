import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { enforceGlobalAndUserRateLimit } from "@/lib/rate-limit";
import AuditLog from "@/models/AuditLog";
import { hasRole } from "@/lib/rbac";

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
  const limitParam = searchParams.get("limit") ?? "50";
  const limit = Math.min(Number(limitParam), 200);
  const action = searchParams.get("action") ?? undefined;
  const resource = searchParams.get("resource") ?? undefined;
  const before = searchParams.get("before") ?? undefined;

  await connectToDatabase();
  const query: Record<string, unknown> = { userId };
  if (action) query.action = action;
  if (resource) query.resource = resource;
  if (before) query.createdAt = { $lt: new Date(before) };

  const logs = await AuditLog.find(query).sort({ createdAt: -1 }).limit(limit);

  return NextResponse.json({
    data: logs.map((log) => ({
      id: log._id.toString(),
      action: log.action,
      resource: log.resource,
      metadata: log.metadata,
      createdAt: log.createdAt,
    })),
    nextCursor: logs.length ? logs[logs.length - 1].createdAt : null,
  });
}
