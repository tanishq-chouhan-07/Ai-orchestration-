import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { decryptString } from "@/lib/encryption";
import { hasRole } from "@/lib/rbac";
import Instance from "@/models/Instance";
import { deactivateWorkflow } from "@/services/n8n";
import { writeAuditLog } from "@/services/audit";

type RouteContext = { params: { id: string } };

export async function POST(request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user || !(session.user as { id?: string; role?: string }).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as { role?: string }).role ?? "viewer";
  if (!hasRole(role as "viewer" | "operator" | "admin", "operator")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const instanceId = searchParams.get("instanceId");
  if (!instanceId) {
    return NextResponse.json({ error: "Missing instanceId" }, { status: 400 });
  }

  await connectToDatabase();
  const userId = (session.user as { id: string }).id;
  const instance = await Instance.findOne({ _id: instanceId, userId });
  if (!instance) {
    return NextResponse.json({ error: "Instance not found" }, { status: 404 });
  }

  const apiKey = decryptString(instance.encryptedApiKey);
  const result = await deactivateWorkflow(instance.url, apiKey, context.params.id);
  await writeAuditLog({
    userId,
    action: "workflows.deactivate",
    resource: context.params.id,
    metadata: { instanceId },
  });
  return NextResponse.json({ data: result });
}
