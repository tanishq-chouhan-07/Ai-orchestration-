import { connectToDatabase } from "@/lib/db";
import { redactObject } from "@/lib/redaction";
import WebhookEvent from "@/models/WebhookEvent";

type WebhookPayload = {
  source: string;
  payload: Record<string, unknown>;
};

export async function handleWebhook(input: WebhookPayload) {
  await connectToDatabase();
  const redactedPayload = redactObject(input.payload) as Record<string, unknown>;
  return WebhookEvent.create({
    source: input.source,
    payload: redactedPayload,
  });
}
