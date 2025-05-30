import mongoose, { Schema, Document, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

// Define ISupportTag interface
export interface ISupportTag extends Document {
  _id?: string;
  name: string;
  count: number;
  createdAt?: Date;
}

// Define the SupportTags schema
const SupportTagsSchema: Schema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
    },
    count: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

// Create and export the SupportTags model
const SupportTagsModel: Model<ISupportTag> = mongoose.model<ISupportTag>(
  "SupportTags",
  SupportTagsSchema,
);

export default SupportTagsModel;
