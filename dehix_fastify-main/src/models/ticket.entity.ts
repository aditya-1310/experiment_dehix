import mongoose, { Schema, Document, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

// Define Enums for customerType and status
export enum CustomerType {
  BUSINESS = "BUSINESS",
  FREELANCER = "FREELANCER",
}

export enum TicketStatus {
  CREATED = "CREATED",
  CLOSED = "CLOSED",
  ACTIVE = "ACTIVE",
}

export interface ITags extends Document {
  _id: string;
  name: string;
}

// Define ITicket interface
export interface ITicket extends Document {
  _id?: string;
  customerID?: string;
  customerType: CustomerType;
  title: string;
  description?: string;
  filesAttached?: string[];
  status: TicketStatus;
  subject?: string;
  solution: string;
  supportTags: ITags[];
}

// Define the Ticket schema
const TicketSchema: Schema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
      required: true,
    },
    customerID: {
      type: String,
      required: true,
    },
    customerType: {
      type: String,
      enum: Object.values(CustomerType), // Enum values for customerType
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    filesAttached: {
      type: [String], // Array of strings for files attached
      default: [],
    },
    status: {
      type: String,
      enum: Object.values(TicketStatus), // Enum values for status
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    supportTags: [
      {
        tagId: { type: String },
        tagName: { type: String },
      },
    ],
    solution: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Create and export the Ticket model
export const TicketModel: Model<ITicket> = mongoose.model<ITicket>(
  "Ticket",
  TicketSchema,
);
