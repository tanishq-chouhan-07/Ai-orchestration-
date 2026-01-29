import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { enforceRateLimit, getRateLimitDefaults } from "@/lib/rate-limit";

export async function GET() {
  try {
    const { windowMs, globalLimit } = getRateLimitDefaults();
    const rateLimitResponse = enforceRateLimit("system:health", globalLimit, windowMs);
    if (rateLimitResponse) return rateLimitResponse;

    await connectToDatabase();
    const dbState = mongoose.connection.readyState;
    return NextResponse.json({ status: "ok", dbState });
  } catch (error) {
    return NextResponse.json({ status: "error", message: "DB unavailable" }, { status: 503 });
  }
}
