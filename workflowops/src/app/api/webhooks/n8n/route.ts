import { NextResponse } from "next/server";
import crypto from "crypto";
import { enforceRateLimit, getRateLimitDefaults } from "@/lib/rate-limit";
import { handleWebhook } from "@/services/webhook";

function extractSignature(headerValue: string) {
  const trimmed = headerValue.trim();
  if (trimmed.includes(",")) {
    const parts = trimmed.split(",").map((part) => part.trim());
    for (const part of parts) {
      const [key, value] = part.split("=");
      if (!value) continue;
      if (["v1", "sha256", "signature"].includes(key)) return value.trim();
    }
  }
  const [key, value] = trimmed.split("=");
  if (value && key && /^(v1|sha256|signature)$/i.test(key)) {
    return value.trim();
  }
  return trimmed;
}

function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a, "utf8");
  const bBuffer = Buffer.from(b, "utf8");
  if (aBuffer.length !== bBuffer.length) return false;
  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

function verifySignature(payload: string, signature: string, secret: string) {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payload, "utf8");
  const digest = hmac.digest();
  const hex = digest.toString("hex");
  const base64 = digest.toString("base64");
  return safeEqual(signature, hex) || safeEqual(signature, base64);
}

export async function POST(request: Request) {
  try {
    const { windowMs, globalLimit } = getRateLimitDefaults();
    const rateLimitResponse = enforceRateLimit("webhook:n8n", globalLimit, windowMs);
    if (rateLimitResponse) return rateLimitResponse;

    const rawBody = await request.text();
    const secret = process.env.N8N_WEBHOOK_SECRET;
    const signatureHeader = (process.env.N8N_WEBHOOK_SIGNATURE_HEADER ?? "x-n8n-signature").toLowerCase();
    const signature = request.headers.get(signatureHeader);

    if (secret) {
      const extracted = signature ? extractSignature(signature) : null;
      if (!extracted || !verifySignature(rawBody, extracted, secret)) {
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
