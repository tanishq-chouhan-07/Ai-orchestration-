import { connectToDatabase } from "@/lib/db";
import AuditLog from "@/models/AuditLog";

type AuditPayload = {
  userId: string;
  action: string;
  resource: string;
  metadata?: Record<string, unknown>;
};

export async function writeAuditLog(payload: AuditPayload) {
  await connectToDatabase();
  await AuditLog.create({
    userId: payload.userId,
    action: payload.action,
    resource: payload.resource,
    metadata: payload.metadata,
  });
}
