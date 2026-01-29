import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { enforceRateLimit, getRateLimitDefaults } from "@/lib/rate-limit";
import User from "@/models/User";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const { windowMs, globalLimit } = getRateLimitDefaults();
    const rateLimitResponse = enforceRateLimit("auth:register", globalLimit, windowMs);
    if (rateLimitResponse) return rateLimitResponse;

    const body = await request.json();
    const payload = registerSchema.parse(body);

    await connectToDatabase();
    const existing = await User.findOne({ email: payload.email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const user = await User.create({
      email: payload.email.toLowerCase(),
      password: payload.password,
      name: payload.name,
    });

    return NextResponse.json({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid payload", issues: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
