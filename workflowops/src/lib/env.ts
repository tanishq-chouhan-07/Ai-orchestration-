import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(1),
  ENCRYPTION_KEY: z.string().min(1),
  NODE_ENV: z.string().optional(),
  N8N_TEST_INSTANCE_URL: z.string().optional(),
  N8N_TEST_API_KEY: z.string().optional(),
  N8N_WEBHOOK_SECRET: z.string().optional(),
  N8N_WEBHOOK_SIGNATURE_HEADER: z.string().optional(),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().optional(),
  RATE_LIMIT_GLOBAL_MAX: z.coerce.number().int().positive().optional(),
  RATE_LIMIT_USER_MAX: z.coerce.number().int().positive().optional(),
});

export const env = envSchema.parse({
  MONGODB_URI: process.env.MONGODB_URI,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  NODE_ENV: process.env.NODE_ENV,
  N8N_TEST_INSTANCE_URL: process.env.N8N_TEST_INSTANCE_URL,
  N8N_TEST_API_KEY: process.env.N8N_TEST_API_KEY,
  N8N_WEBHOOK_SECRET: process.env.N8N_WEBHOOK_SECRET,
  N8N_WEBHOOK_SIGNATURE_HEADER: process.env.N8N_WEBHOOK_SIGNATURE_HEADER,
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_GLOBAL_MAX: process.env.RATE_LIMIT_GLOBAL_MAX,
  RATE_LIMIT_USER_MAX: process.env.RATE_LIMIT_USER_MAX,
});

export type Env = typeof env;
export type EnvKey = keyof Env;

export const isProduction = env.NODE_ENV === "production";

export function getEnv<K extends EnvKey>(key: K) {
  return env[key];
}

export function getRequiredEnv<K extends EnvKey>(key: K, message?: string) {
  const value = env[key];
  if (value === undefined || value === "") {
    throw new Error(message ?? `Missing environment variable: ${String(key)}`);
  }
  return value;
}
