import mongoose, { Schema, type Document, type Types } from "mongoose";

export interface IInstance extends Document {
  userId: Types.ObjectId;
  name: string;
  url: string;
  encryptedApiKey: string;
  isActive: boolean;
  lastHealthCheck: Date | null;
  healthStatus: "healthy" | "unhealthy" | "unknown";
}

const InstanceSchema = new Schema<IInstance>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    encryptedApiKey: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    lastHealthCheck: { type: Date, default: null },
    healthStatus: { type: String, enum: ["healthy", "unhealthy", "unknown"], default: "unknown" },
  },
  { timestamps: true }
);

InstanceSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Instance || mongoose.model<IInstance>("Instance", InstanceSchema);
