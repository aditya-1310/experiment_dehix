import mongoose, { Schema, Document, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const { String } = Schema.Types;

// Enum for Ads Type and Status
export enum AdsTypeEnum {
  BUSINESS = "BUSINESS",
  FREELANCER = "FREELANCER",
  BOTH = "BOTH",
}
export enum AdsStatusEnum {
  ACTIVE = "ACTIVE",
  IN_ACTIVE = "IN_ACTIVE",
}

export interface IAds extends Document {
  _id: string;
  heading: string;
  description: string;
  type: AdsTypeEnum;
  status: AdsStatusEnum;
  background_img?: string;
  importantUrl?: {
    urlName?: string;
    url?: string;
  }[];
}

const AdsSchema: Schema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
      required: true,
    },
    heading: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(AdsTypeEnum),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(AdsStatusEnum),
      required: true,
    },
    background_img: {
      type: String,
      required: false,
    },
    importantUrl: [
      {
        urlName: { type: String, required: false },
        url: { type: String, required: false },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const AdsModel: Model<IAds> = mongoose.model<IAds>("Ads", AdsSchema);
