import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { decryptString } from "@/lib/encryption";
import { redactObject } from "@/lib/redaction";
import Instance from "@/models/Instance";
import { getCachedExecutions, setCachedExecutions } from "@/services/cache";
import { fetchExecutions } from "@/services/n8n";

const DEFAULT_CACHE_MS = 5 * 60 * 1000;

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user || !(session.user as { id?: string }).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const instanceId = searchParams.get("instanceId");
  if (!instanceId) {
    return NextResponse.json({ error: "Missing instanceId" }, { status: 400 });
  }

  const workflowId = searchParams.get("workflowId") ?? "all";
  const status = searchParams.get("status") ?? undefined;
  const limit = searchParams.get("limit") ?? undefined;
  const cursor = searchParams.get("cursor") ?? undefined;

  await connectToDatabase();
  const userId = (session.user as { id: string }).id;
  const instance = await Instance.findOne({ _id: instanceId, userId });
  if (!instance) {
    return NextResponse.json({ error: "Instance not found" }, { status: 404 });
  }

  const cached = await getCachedExecutions(instanceId, workflowId, DEFAULT_CACHE_MS);
  if (cached) {
    return NextResponse.json({ data: cached, cached: true });
  }

  const apiKey = decryptString(instance.encryptedApiKey);
  const executions = await fetchExecutions(instance.url, apiKey, {
    workflowId: workflowId === "all" ? undefined : workflowId,
    status,
    limit,
    cursor,
  });

  const redacted = redactObject(executions) as unknown[];
  await setCachedExecutions(instanceId, workflowId, redacted);
  return NextResponse.json({ data: redacted, cached: false });
}
