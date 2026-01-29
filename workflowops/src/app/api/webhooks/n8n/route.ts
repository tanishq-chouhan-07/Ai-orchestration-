import { NextResponse } from "next/server";
import crypto from "crypto";
import { handleWebhook } from "@/services/webhook";

function verifySignature(payload: string, signature: string, secret: string) {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payload, "utf8");
  const digest = hmac.digest("hex");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const secret = process.env.N8N_WEBHOOK_SECRET;
    const signature = request.headers.get("x-n8n-signature");

    if (secret) {
      if (!signature || !verifySignature(rawBody, signature, secret)) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody) as Record<string, unknown>;
    await handleWebhook({ source: "n8n", payload });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
