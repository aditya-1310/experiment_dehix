import mongoose, { Schema, Document, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { ITags } from "./ticket.entity";

// Define the StatusEnum for 'ACTIVE' and 'INACTIVE'
export enum StatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

// Define the type for Faq categories
export enum FaqTypeEnum {
  BUSINESS = "BUSINESS",
  FREELANCER = "FREELANCER",
  BOTH = "BOTH",
}

// Interface to represent the Faq model
export interface IFaq extends Document {
  _id?: string;
  question: string;
  answer: string;
  type: FaqTypeEnum; // Using FaqTypeEnum for consistency
  status?: StatusEnum; // Using StatusEnum for consistency
  importantUrl?: {
    urlName?: string;
    url?: string;
  }[];
  supportTags: ITags[];
}

// Faq schema to define the structure of the Faq model
const FaqSchema: Schema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(FaqTypeEnum), // Use FaqTypeEnum to define possible types
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(StatusEnum), // Use StatusEnum for 'ACTIVE' and 'INACTIVE' status
      default: StatusEnum.ACTIVE, // Default status is 'ACTIVE'
    },
    importantUrl: [
      {
        urlName: { type: String, required: false },
        url: { type: String, required: false },
      },
    ],
    supportTags: [
      {
        tagId: { type: String },
        tagName: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Faq model to perform CRUD operations
export const FaqModel: Model<IFaq> = mongoose.model<IFaq>("Faq", FaqSchema);

export default {
  FaqModel,
};
