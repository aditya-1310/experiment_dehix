import mongoose, { Schema, Document, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export enum FromType {
  SYSTEM = "system",
  FREELANCER = "freelancer",
  BUSINESS = "business",
  ADMIN = "admin",
  VERIFICATION = "verification",
}

export enum Type {
  PAYMENT = "payment",
  REFERRAL = "referral",
  REWARDS = "rewards",
  SYSTEM_GENERATED = "system generated",
}
export const VERIFICATION_ENUM_TYPES = {
  FROM_TYPE: Object.values(FromType),
  TYPE: Object.values(Type),
};

export interface ITransaction extends Document {
  _id?: string;
  from?: string;
  to?: string;
  amount?: number;
  type?: Type;
  reference?: string;
  from_type?: FromType;
  reference_id?: string;
}

const TransactionSchema: Schema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(Type),
      required: true,
    },
    reference: {
      type: String,
      required: false,
    },
    from_type: {
      type: String,
      enum: Object.values(FromType),
      required: true,
    },
    reference_id: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

export const TransactionModel: Model<ITransaction> =
  mongoose.model<ITransaction>("Transaction", TransactionSchema);
