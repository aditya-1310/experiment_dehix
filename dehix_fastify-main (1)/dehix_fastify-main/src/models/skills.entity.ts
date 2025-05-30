import mongoose, { Schema, Document, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

// Define Enums for Status with uppercase values
export enum SkillStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ARCHIVED = "ARCHIVED",
}

export enum CreatedByEnum {
  ADMIN = "ADMIN",
  BUSINESS = "BUSINESS",
  FREELANCER = "FREELANCER",
}

export interface ISkill extends Document {
  _id: string;
  label: string;
  description?: string; // Optional field
  createdBy?: CreatedByEnum;
  createdById?: string;
  createdAt?: Date;
  updatedAt?: Date;
  status: SkillStatus; // Use SkillStatus Enum
}

// Define the Skill schema
const SkillSchema: Schema<ISkill> = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4, // Use uuidv4 for generating unique IDs
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false, // Optional description field
    },
    createdBy: {
      type: String,
      enum: Object.values(CreatedByEnum),
      default: CreatedByEnum.ADMIN,
    },
    createdById: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(SkillStatus), // Use the SkillStatus Enum for status
      default: SkillStatus.ACTIVE, // Default to "ACTIVE"
    },
  },
  {
    timestamps: true, // Add createdAt and updatedAt fields
    versionKey: false, // Disable __v versioning field
  },
);

// Create and export the Skill model
export const SkillModel: Model<ISkill> = mongoose.model<ISkill>(
  "Skill",
  SkillSchema,
);

export default {
  SkillModel,
};
