import mongoose, { Schema, Document, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

// Define Enums in TypeScript
export enum AdminStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export enum AdminType {
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}
export enum PasswordStatus {
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
}
export interface IChangePasswordRequest {
  requestedAt: Date; // The time the change was requested
  passwordStatus: PasswordStatus;
  acceptedBy?: string; // ID of the admin who accepted the request (optional)
}
// Define IAdmin interface with enums
export interface IAdmin extends Document {
  _id?: string;
  profilePic: string;
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  email: string;
  phone: string;
  status: AdminStatus; // Use TypeScript enum
  type: AdminType; // Use TypeScript enum
  changePasswordRequests: IChangePasswordRequest[];
  resetRequest: boolean;
}
const ChangePasswordRequestSchema: Schema = new Schema(
  {
    requestedAt: {
      type: Date,
      required: true,
    },
    passwordStatus: {
      type: String,
      enum: Object.values(PasswordStatus),
      required: false,
    },
    acceptedBy: {
      type: String,
      required: false, // This field is optional, as the request might not yet be accepted
    },
  },
  { _id: false }, // Disable `_id` for subdocuments to avoid unnecessary IDs
);
const AdminSchema: Schema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
      required: true,
    },
    profilePic: {
      type: String,
      required: false,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: Object.values(AdminStatus), // Use enum values from AdminStatus
      default: AdminStatus.PENDING, // Default value from the enum
    },
    type: {
      type: String,
      enum: Object.values(AdminType), // Use enum values from AdminType
      default: AdminType.ADMIN, // Default value from the enum
    },
    changePasswordRequests: {
      type: [ChangePasswordRequestSchema], // Embedding the sub-schema for change requests
      default: [], // Initialize with an empty array
    },
    resetRequest: {
      type: Boolean, // Boolean field
      default: false, // Default value is false
    },
  },
  {
    timestamps: true,
  },
);

// Model for Admin
export const AdminModel: Model<IAdmin> = mongoose.model<IAdmin>(
  "Admin",
  AdminSchema,
);
