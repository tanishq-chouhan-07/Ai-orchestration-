import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { enforceGlobalAndUserRateLimit } from "@/lib/rate-limit";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;
  if (userId) {
    const rateLimitResponse = enforceGlobalAndUserRateLimit(userId);
    if (rateLimitResponse) return rateLimitResponse;
  }

  return NextResponse.json({ user: session.user });
}
