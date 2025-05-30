import mongoose, { Schema, Document, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IApplicationForWork extends Document {
  _id: string;
  desiredSalary: string;
  role: string;
  status: string;
  projectId: string;
}

const applyForPositionSchema: Schema<IApplicationForWork> = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
      required: true,
    },
    desiredSalary: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
    },
    projectId: {
      type: String,
      ref: "ProjectListByCompany",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const ApplicationForWorkModel: Model<IApplicationForWork> =
  mongoose.model<IApplicationForWork>(
    "Applicationforwork",
    applyForPositionSchema,
  );

export default ApplicationForWorkModel;
