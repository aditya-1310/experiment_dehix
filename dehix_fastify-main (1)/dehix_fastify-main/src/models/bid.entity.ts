import mongoose, { Schema, Document, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

// Enum for Bid Status
export enum StatusEnum {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  PANEL = "PANEL",
  INTERVIEW = "INTERVIEW",
}

// Define an interface for the Bid document
export interface IBid extends Document {
  _id: string;
  bidder_id: string;
  userName: string;
  current_price: number;
  project_id: string;
  profile_id: string;
  bid_status: StatusEnum;
  description: string;
  domain_id: string;
}

// Define the Bid schema
const BidSchema: Schema<IBid> = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
      required: true,
    },
    userName: {
      type: String,
    },
    bidder_id: {
      type: String,
      required: true,
    },
    current_price: {
      type: Number,
      required: true,
      default: 0, // Set a default value if needed
    },
    project_id: {
      type: String,
      required: true,
    },
    profile_id: {
      type: String,
    },
    domain_id: {
      type: String,
    },
    bid_status: {
      type: String,
      enum: Object.values(StatusEnum),
      default: StatusEnum.PENDING,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Create and export the Bid model
export const BidModel: Model<IBid> = mongoose.model<IBid>("Bid", BidSchema);

export default {
  BidModel,
};
