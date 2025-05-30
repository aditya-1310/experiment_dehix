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

export interface INote extends Document {
  _id: string;
  userId: string;
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

const noteSchema: Schema<INote> = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    userId: {
      type: String,
      required: [true, "userId is required"],
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
      enum: Object.values(NotesEntityType),
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

const NoteModel: Model<INote> = mongoose.model<INote>("Note", noteSchema);

export default NoteModel;
