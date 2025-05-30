import mongoose, { Schema, Document, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
export interface IConsultant extends Document {
  status?: string;
  description?: string;
  price?: number;
  experience?: string;
  links?: string[];
}
const ConsultantSchema: Schema<IConsultant> = new Schema({
  _id: {
    type: String,
    default: uuidv4,
    required: true,
  },
  status: { type: String, required: false },
  description: { type: String, required: false },
  price: { type: Number, required: false },
  experience: { type: String, required: false },
  links: { type: [String], required: false },
});
export const ConsultantModel: Model<IConsultant> = mongoose.model<IConsultant>(
  "consultant",
  ConsultantSchema,
);
export default {
  ConsultantModel,
};
