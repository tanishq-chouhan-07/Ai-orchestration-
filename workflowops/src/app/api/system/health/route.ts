import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { startScheduler } from "@/jobs/scheduler";

export async function GET() {
  try {
    startScheduler();
    await connectToDatabase();
    const dbState = mongoose.connection.readyState;
    return NextResponse.json({ status: "ok", dbState });
  } catch (error) {
    return NextResponse.json({ status: "error", message: "DB unavailable" }, { status: 503 });
  }
}
