import mongoose, { Schema, Document, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

// Define Enums for UserType and status
export enum UserType {
  BUSINESS = "BUSINESS",
  FREELANCER = "FREELANCER",
}

export enum TokenRequestStatus {
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  ACCEPTED = "APPROVED",
}

// Define ITokenRequest interface
export interface ITokenRequest extends Document {
  _id?: string;
  userId: string;
  userType?: UserType;
  amount: string;
  transactionId?: string;
  status: TokenRequestStatus;
  dateTime?: Date;
}

// Define the TokenRequest schema
const TokenRequestSchema: Schema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: Object.values(UserType), // Enum values for UserType
      required: true,
    },
    amount: {
      type: String,
      required: true,
      default: "100",
    },
    transactionId: {
      type: String,
      enum: Object.values(UserType), // Enum values for UserType
    },
    status: {
      type: String,
      enum: Object.values(TokenRequestStatus), // Enum values for status
      default: TokenRequestStatus.PENDING,
    },
    dateTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Create and export the TokenRequest model
export const TokenRequestModel: Model<ITokenRequest> =
  mongoose.model<ITokenRequest>("TokenRequest", TokenRequestSchema);
