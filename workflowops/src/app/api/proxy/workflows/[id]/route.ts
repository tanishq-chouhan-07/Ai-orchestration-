import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { decryptString } from "@/lib/encryption";
import { hasRole } from "@/lib/rbac";
import { enforceGlobalAndUserRateLimit } from "@/lib/rate-limit";
import Instance from "@/models/Instance";
import { fetchWorkflowById, updateWorkflow, N8nError } from "@/services/n8n";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
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

  await connectToDatabase();
  const instance = await Instance.findOne({ _id: instanceId, userId });
  if (!instance) {
    return NextResponse.json({ error: "Instance not found" }, { status: 404 });
  }

  const apiKey = decryptString(instance.encryptedApiKey);

  try {
    const workflow = await fetchWorkflowById(instance.url, apiKey, id);
    return NextResponse.json({ data: workflow });
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

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const session = await auth();
  if (!session?.user || !(session.user as { id?: string; role?: string }).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as { role?: string }).role ?? "viewer";
  if (!hasRole(role as "viewer" | "operator" | "admin", "operator")) {
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

  const payload = await request.json();

  await connectToDatabase();
  const instance = await Instance.findOne({ _id: instanceId, userId });
  if (!instance) {
    return NextResponse.json({ error: "Instance not found" }, { status: 404 });
  }

  const apiKey = decryptString(instance.encryptedApiKey);

  try {
    const updated = await updateWorkflow(instance.url, apiKey, id, payload);
    return NextResponse.json({ data: updated });
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
