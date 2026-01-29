import mongoose, { Schema, type Document, type Types } from "mongoose";

export interface IExecutionCache extends Document {
  instanceId: Types.ObjectId;
  workflowId: string;
  executions: unknown[];
  cachedAt: Date;
}

const ExecutionCacheSchema = new Schema<IExecutionCache>(
  {
    instanceId: { type: Schema.Types.ObjectId, ref: "Instance", required: true, index: true },
    workflowId: { type: String, required: true },
    executions: { type: Array, default: [] },
    cachedAt: { type: Date, default: Date.now, expires: 600 },
  },
  { timestamps: true }
);

ExecutionCacheSchema.index({ instanceId: 1, workflowId: 1, cachedAt: -1 });

export default mongoose.models.ExecutionCache ||
  mongoose.model<IExecutionCache>("ExecutionCache", ExecutionCacheSchema);
