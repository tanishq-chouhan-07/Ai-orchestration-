import mongoose, { Schema, type Document } from "mongoose";

export interface IWebhookEvent extends Document {
  source: string;
  payload: Record<string, unknown>;
}

const WebhookEventSchema = new Schema<IWebhookEvent>(
  {
    source: { type: String, required: true },
    payload: { type: Object, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.WebhookEvent ||
  mongoose.model<IWebhookEvent>("WebhookEvent", WebhookEventSchema);
