import mongoose, { Schema, Document, Model } from "mongoose";

export interface INoteOrder extends Document {
  userId: string;
  noteOrder: {
    notes: string[];
    archive: string[];
    trash: string[];
  };
}

const noteOrderSchema: Schema<INoteOrder> = new Schema(
  {
    userId: {
      type: String,
      required: [true, "userId is required"],
      unique: true,
    },
    noteOrder: {
      notes: {
        type: [String],
        default: [],
      },
      archive: {
        type: [String],
        default: [],
      },
      trash: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  },
);

const NoteOrderModel: Model<INoteOrder> = mongoose.model<INoteOrder>(
  "NoteOrder",
  noteOrderSchema,
);

export default NoteOrderModel;
