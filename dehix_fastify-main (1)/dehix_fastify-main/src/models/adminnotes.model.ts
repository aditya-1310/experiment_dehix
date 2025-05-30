/* eslint-disable prettier/prettier */
import mongoose, { Schema, Document, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export enum NotesEntityType {
  BUSINESS = "BUSINESS",
  FREELANCER = "FREELANCER",
  TRANSACTION = "TRANSACTION",
  PROJECT = "PROJECT",
  BID = "BID",
  INTERVIEW = "INTERVIEW",
  DEHIX_TALENT = "DEHIX_TALENT",
}

export enum NoteType {
  NOTE = "NOTE",
  TRASH = "TRASH",
  ARCHIVE = "ARCHIVE",
}

export enum LabelType {
  PERSONAL = "PERSONAL",
  WORK = "WORK",
  REMINDER = "REMINDER",
  TASK = "TASK",
}

export interface IAdminNote extends Document {
  _id: string;
  adminId: string;
  userId: string;
  username: string;
  title: string;
  content: string;
  bgColor?: string;
  banner?: string;
  isHTML: boolean;
  entityID?: string;
  entityType?: NotesEntityType;
  noteType: NoteType;
  type?: LabelType;
}

const adminNoteSchema: Schema<IAdminNote> = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    adminId: {
      type: String,
      required: [true, "adminId is requried"],
    },
    userId: {
      type: String,
      required: [true, "userId is required"],
    },
    username: {
      type: String,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    bgColor: {
      type: String,
      default: "#FFFFFF",
    },
    banner: {
      type: String,
      default: "",
    },
    isHTML: {
      type: Boolean,
      default: false,
    },
    entityID: {
      type: String,
      default: "",
    },
    entityType: {
      type: String,
      enum: NotesEntityType,
    },
    noteType: {
      type: String,
      enum: Object.values(NoteType),
      default: NoteType.NOTE, // Default to 'note'
    },
    type: {
      type: String,
      enum: Object.values(LabelType),
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const AdminNoteModel: Model<IAdminNote> = mongoose.model<IAdminNote>(
  "AdminNote",
  adminNoteSchema,
);

export default AdminNoteModel;
