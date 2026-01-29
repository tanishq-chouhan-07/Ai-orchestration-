import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { decryptString } from "@/lib/encryption";
import Instance from "@/models/Instance";
import { fetchExecutions } from "@/services/n8n";
import { getCostEstimate } from "@/services/analytics";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user || !(session.user as { id?: string }).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const instanceId = searchParams.get("instanceId");
  const unitCostParam = searchParams.get("unitCost");
  if (!instanceId) {
    return NextResponse.json({ error: "Missing instanceId" }, { status: 400 });
  }
  if (!unitCostParam) {
    return NextResponse.json({ error: "Missing unitCost" }, { status: 400 });
  }

  const unitCost = Number(unitCostParam);
  if (!Number.isFinite(unitCost) || unitCost < 0) {
    return NextResponse.json({ error: "Invalid unitCost" }, { status: 400 });
  }

  const workflowId = searchParams.get("workflowId") ?? undefined;
  const limit = searchParams.get("limit") ?? "100";

  await connectToDatabase();
  const userId = (session.user as { id: string }).id;
  const instance = await Instance.findOne({ _id: instanceId, userId });
  if (!instance) {
    return NextResponse.json({ error: "Instance not found" }, { status: 404 });
  }

  const apiKey = decryptString(instance.encryptedApiKey);
  const executions = await fetchExecutions(instance.url, apiKey, {
    workflowId,
    limit,
  });

  const costs = getCostEstimate(executions as Array<{ status?: string }>, unitCost);
  return NextResponse.json({ data: costs });
}
