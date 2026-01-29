import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(1),
  ENCRYPTION_KEY: z.string().min(1),
  NODE_ENV: z.string().optional(),
  N8N_TEST_INSTANCE_URL: z.string().optional(),
  N8N_TEST_API_KEY: z.string().optional(),
});

export const env = envSchema.parse({
  MONGODB_URI: process.env.MONGODB_URI,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  NODE_ENV: process.env.NODE_ENV,
  N8N_TEST_INSTANCE_URL: process.env.N8N_TEST_INSTANCE_URL,
  N8N_TEST_API_KEY: process.env.N8N_TEST_API_KEY,
});

// TODO: expose typed env helpers
