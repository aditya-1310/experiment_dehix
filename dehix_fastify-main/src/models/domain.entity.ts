import mongoose, { Schema, Document, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

// Define Enum for Domain Status
export enum DomainStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ARCHIVED = "ARCHIVED",
}

export enum CreatedByEnum {
  ADMIN = "ADMIN",
  BUSINESS = "BUSINESS",
  FREELANCER = "FREELANCER",
}

// Define the Domain interface using the Enum
export interface IDomain extends Document {
  _id: string;
  label: string;
  description?: string;
  createdBy?: CreatedByEnum;
  createdById?: string;
  status: DomainStatus; // Use the DomainStatus Enum
  createdAt: Date; // Managed by Mongoose
  updatedAt: Date; // Managed by Mongoose
}

// Domain Schema definition
const DomainSchema: Schema<IDomain> = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4, // Default to UUID v4
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
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
      enum: Object.values(DomainStatus), // Use Enum values for status
      default: DomainStatus.ACTIVE, // Default to ACTIVE
    },
  },
  {
    timestamps: true, // Mongoose will automatically handle createdAt and updatedAt
    versionKey: false, // Disable versioning (_v field)
  },
);

// Domain model to perform CRUD operations
export const DomainModel: Model<IDomain> = mongoose.model<IDomain>(
  "Domain",
  DomainSchema,
);

export default {
  DomainModel,
};
