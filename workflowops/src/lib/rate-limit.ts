import { NextResponse } from "next/server";

export type RateLimitConfig = {
  limit: number;
  windowMs: number;
};

type Bucket = { count: number; resetAt: number };

type RateLimitState = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
};

function getStore() {
  const globalAny = globalThis as unknown as { __rateLimitStore?: Map<string, Bucket> };
  if (!globalAny.__rateLimitStore) {
    globalAny.__rateLimitStore = new Map();
  }
  return globalAny.__rateLimitStore;
}

export function getRateLimitDefaults() {
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
  const globalLimit = Number(process.env.RATE_LIMIT_GLOBAL_MAX ?? 120);
  const userLimit = Number(process.env.RATE_LIMIT_USER_MAX ?? 60);

  return {
    windowMs,
    globalLimit,
    userLimit,
  };
}

export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitState {
  const now = Date.now();
  const store = getStore();
  const bucket = store.get(key) ?? { count: 0, resetAt: now + windowMs };

  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + windowMs;
  }

  bucket.count += 1;
  store.set(key, bucket);

  const remaining = Math.max(0, limit - bucket.count);
  const allowed = bucket.count <= limit;

  return {
    allowed,
    remaining,
    resetAt: bucket.resetAt,
    limit,
  };
}

export function rateLimitResponse(state: RateLimitState) {
  const retryAfterSeconds = Math.max(0, Math.ceil((state.resetAt - Date.now()) / 1000));
  return NextResponse.json(
    {
      error: "Rate limit exceeded",
      retryAfterSeconds,
    },
    {
      status: 429,
      headers: {
        "retry-after": String(retryAfterSeconds),
        "x-ratelimit-limit": String(state.limit),
        "x-ratelimit-remaining": String(state.remaining),
        "x-ratelimit-reset": String(state.resetAt),
      },
    }
  );
}

export function enforceRateLimit(key: string, limit: number, windowMs: number) {
  const state = checkRateLimit(key, limit, windowMs);
  if (!state.allowed) {
    return rateLimitResponse(state);
  }
  return null;
}

export function enforceGlobalAndUserRateLimit(userId: string) {
  const { windowMs, globalLimit, userLimit } = getRateLimitDefaults();
  const globalLimitResponse = enforceRateLimit("global", globalLimit, windowMs);
  if (globalLimitResponse) return globalLimitResponse;
  return enforceRateLimit(`user:${userId}`, userLimit, windowMs);
}
