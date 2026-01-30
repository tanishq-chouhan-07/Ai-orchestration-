import { NextResponse } from "next/server";

export const runtime = "nodejs";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { decryptString } from "@/lib/encryption";
import { hasRole } from "@/lib/rbac";
import { enforceGlobalAndUserRateLimit } from "@/lib/rate-limit";
import Instance from "@/models/Instance";
import { fetchExecutions, N8nError } from "@/services/n8n";
import { getStats } from "@/services/analytics";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user || !(session.user as { id?: string; role?: string }).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as { role?: string }).role ?? "viewer";
  if (!hasRole(role as "viewer" | "operator" | "admin", "viewer")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const userId = (session.user as { id: string }).id;
  const rateLimitResponse = enforceGlobalAndUserRateLimit(userId);
  if (rateLimitResponse) return rateLimitResponse;

  const { searchParams } = new URL(request.url);
  const instanceId = searchParams.get("instanceId");
  if (!instanceId) {
    return NextResponse.json({ error: "Missing instanceId" }, { status: 400 });
  }

  const workflowId = searchParams.get("workflowId") ?? undefined;
  const limit = searchParams.get("limit") ?? "100";

  await connectToDatabase();
  const instance = await Instance.findOne({ _id: instanceId, userId });
  if (!instance) {
    return NextResponse.json({ error: "Instance not found" }, { status: 404 });
  }

  const apiKey = decryptString(instance.encryptedApiKey);

  try {
    const executions = await fetchExecutions(instance.url, apiKey, {
      workflowId,
      limit,
    });

    const stats = getStats(executions as Array<{ status?: string; startedAt?: string; stoppedAt?: string }>);
    return NextResponse.json({ data: stats });
  } catch (error) {
    if (error instanceof N8nError) {
      return NextResponse.json(
        { error: error.body || "Upstream error", status: error.status, rateLimit: error.rateLimit },
        { status: error.status }
      );
    }
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }
}
