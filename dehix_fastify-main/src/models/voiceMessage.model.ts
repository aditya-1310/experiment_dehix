import mongoose, { Schema, Document } from "mongoose";

export interface IVoiceMessage extends Document {
  senderId: string;
  receiverId: string; // Can be a user ID or a group ID
  conversationId: string;
  audioUrl: string;
  duration: number; // Duration in seconds
  timestamp: Date;
  // format?: string; // e.g., 'mp3', 'wav'
  // size?: number; // File size in bytes
}

const VoiceMessageSchema: Schema = new Schema({
  senderId: { type: String, required: true, index: true },
  receiverId: { type: String, required: true, index: true },
  conversationId: { type: String, required: true, index: true },
  audioUrl: { type: String, required: true },
  duration: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now, index: true },
  // format: { type: String },
  // size: { type: Number },
});

export default mongoose.model<IVoiceMessage>(
  "VoiceMessage",
  VoiceMessageSchema,
);
