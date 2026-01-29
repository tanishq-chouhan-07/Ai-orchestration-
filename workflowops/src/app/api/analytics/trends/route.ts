import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { decryptString } from "@/lib/encryption";
import Instance from "@/models/Instance";
import { fetchExecutions } from "@/services/n8n";
import { getTrends } from "@/services/analytics";

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

  const workflowId = searchParams.get("workflowId") ?? undefined;
  const daysParam = searchParams.get("days") ?? "14";
  const days = Math.min(Math.max(Number(daysParam), 1), 90);

  await connectToDatabase();
  const userId = (session.user as { id: string }).id;
  const instance = await Instance.findOne({ _id: instanceId, userId });
  if (!instance) {
    return NextResponse.json({ error: "Instance not found" }, { status: 404 });
  }

  const apiKey = decryptString(instance.encryptedApiKey);
  const executions = await fetchExecutions(instance.url, apiKey, {
    workflowId,
    limit: days * 200,
  });

  const trends = getTrends(executions as Array<{ status?: string; startedAt?: string; stoppedAt?: string }>, days);
  return NextResponse.json({ data: trends });
}
