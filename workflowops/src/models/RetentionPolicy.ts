import mongoose, { Schema, type Document, type Types } from "mongoose";

export interface IRetentionPolicy extends Document {
  instanceId: Types.ObjectId;
  workflowId?: string;
  retentionDays: number;
}

const RetentionPolicySchema = new Schema<IRetentionPolicy>(
  {
    instanceId: { type: Schema.Types.ObjectId, ref: "Instance", required: true, index: true },
    workflowId: { type: String },
    retentionDays: { type: Number, required: true, default: 30 },
  },
  { timestamps: true }
);

RetentionPolicySchema.index({ instanceId: 1, workflowId: 1 });

export default mongoose.models.RetentionPolicy ||
  mongoose.model<IRetentionPolicy>("RetentionPolicy", RetentionPolicySchema);
