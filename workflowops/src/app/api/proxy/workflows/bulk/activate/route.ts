import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { decryptString } from "@/lib/encryption";
import { hasRole } from "@/lib/rbac";
import Instance from "@/models/Instance";
import { activateWorkflow } from "@/services/n8n";
import { writeAuditLog } from "@/services/audit";

const bulkSchema = z.object({
  instanceId: z.string().min(1),
  workflowIds: z.array(z.string().min(1)).min(1),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || !(session.user as { id?: string; role?: string }).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role ?? "viewer";
    if (!hasRole(role as "viewer" | "operator" | "admin", "operator")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const payload = bulkSchema.parse(body);

    await connectToDatabase();
    const userId = (session.user as { id: string }).id;
    const instance = await Instance.findOne({ _id: payload.instanceId, userId });
    if (!instance) {
      return NextResponse.json({ error: "Instance not found" }, { status: 404 });
    }

    const apiKey = decryptString(instance.encryptedApiKey);
    const results = await Promise.allSettled(
      payload.workflowIds.map((id) => activateWorkflow(instance.url, apiKey, id))
    );

    const response = results.map((result, index) =>
      result.status === "fulfilled"
        ? { workflowId: payload.workflowIds[index], status: "success" }
        : { workflowId: payload.workflowIds[index], status: "error", error: String(result.reason) }
    );

    await writeAuditLog({
      userId,
      action: "workflows.bulk_activate",
      resource: "bulk",
      metadata: { instanceId: payload.instanceId, count: payload.workflowIds.length },
    });

    return NextResponse.json({
      success: response.filter((r) => r.status === "success").length,
      failed: response.filter((r) => r.status === "error").length,
      results: response,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid payload", issues: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Bulk activate failed" }, { status: 500 });
  }
}
