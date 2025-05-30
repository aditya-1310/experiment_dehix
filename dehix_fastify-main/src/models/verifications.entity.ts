import mongoose, { Schema, Document, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export enum VerificationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DENIED = "DENIED",
}

export enum Type {
  FREELANCER = "FREELANCER",
  ADMIN = "ADMIN",
}
// Define an interface for the Verification document
export interface IVerification extends Document {
  _id: string;
  verifier_id: string;
  verifier_username: string; // Added verifier_username field
  requester_id: string;
  document_id: string;
  doc_type: string; // Added doc_type field
  verification_status: VerificationStatus;
  createdAt: Date;
  updatedAt: Date;
  comment: string;
  verifiedAt: Date;
  type?: Type;
}

// Define the Verification schema
const VerificationSchema: Schema<IVerification> = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
      required: true,
    },
    verifier_id: {
      type: String,
      default: uuidv4,
      required: true,
    },
    verifier_username: {
      type: String,
      required: true,
    },
    requester_id: {
      type: String,
      required: true,
    },
    document_id: {
      type: String,
      required: false,
    },
    doc_type: {
      type: String,
      required: true,
    },
    verification_status: {
      type: String,
      enum: Object.values(VerificationStatus),
      default: VerificationStatus.PENDING,
    },
    comment: {
      type: String,
      required: false,
    },
    verifiedAt: {
      type: Date,
      required: false,
    },
    type: {
      type: String,
      enum: Object.values(Type),
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Create and export the Verification model
export const VerificationModel: Model<IVerification> =
  mongoose.model<IVerification>("Verification", VerificationSchema);

export default {
  VerificationModel,
};
