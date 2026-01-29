import mongoose from "mongoose";
import { logger } from "@/lib/logger";

const MONGODB_URI : string = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI");
}

let cached = (global as unknown as { mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } }).mongoose;
let listenersAttached = (global as unknown as { mongooseListenersAttached?: boolean }).mongooseListenersAttached;

if (!cached) {
  cached = { conn: null, promise: null };
  (global as unknown as { mongoose: typeof cached }).mongoose = cached;
}

export async function connectToDatabase() {
  if (cached!.conn) return cached!.conn;
  if (!cached!.promise) {
    if (!listenersAttached) {
      mongoose.connection.on("connected", () => logger.info("MongoDB connected"));
      mongoose.connection.on("disconnected", () => logger.warn("MongoDB disconnected"));
      mongoose.connection.on("error", (error) => logger.error({ error }, "MongoDB error"));
      (global as unknown as { mongooseListenersAttached: boolean }).mongooseListenersAttached = true;
      listenersAttached = true;
    }

    cached!.promise = mongoose
      .connect(MONGODB_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45_000,
      })
      .then((m) => m);
  }
  cached!.conn = await cached!.promise;
  return cached!.conn;
}
