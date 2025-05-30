import mongoose, { Schema, Document, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IInterview extends Document {
  _id?: string;
  interviewerId?: string;
  intervieweeId: string;
  interviewType: string;
  InterviewStatus?: string;
  description?: string;
  creatorId: string;
  talentType: string;
  talentId: string;
  interviewDate: Date;
  intervieweeDateTimeAgreement?: boolean;
  interviewBids?: Map<
    string,
    {
      _id: string;
      interviewerId: string;
      dateTimeAgreement: boolean;
      suggestedDateTime: Date;
      fee: string;
      status: string;
    }
  >;
  transaction?: {
    transactionId: string;
    status: string;
    fee: string;
  };
  rating?: number;
  comments?: string;
}

export interface IInterview2 extends Document {
  _id?: string;
  interviewerId?: string;
  intervieweeId: string;
  interviewType: string;
  InterviewStatus?: string;
  description?: string;
  creatorId: string;
  talentType: string;
  talentId: any;
  interviewDate: Date;
  intervieweeDateTimeAgreement?: boolean;
  interviewBids?: Map<
    string,
    {
      _id: string;
      interviewerId: string;
      dateTimeAgreement: boolean;
      suggestedDateTime: Date;
      fee: string;
      status: string;
    }
  >;
  transaction?: {
    transactionId: string;
    status: string;
    fee: string;
  };
  rating?: number;
  comments?: string;
}

export enum TalentType {
  SKILL = "SKILL",
  DOMAIN = "DOMAIN",
}

export enum InterviewType {
  BUSINESS = "BUSINESS",
  INTERVIEWER = "INTERVIEWER",
  TALENT = "TALENT",
  GROWTH = "GROWTH",
}

export enum InterviewStatus {
  BIDDING = "BIDDING",
  SCHEDULED = "SCHEDULED",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
}

export enum BidStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

const InterviewSchema: Schema<IInterview> = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    interviewerId: {
      type: String,
      ref: "Freelancer",
    },
    intervieweeId: {
      type: String,
      ref: "Freelancer",
      required: true,
    },
    interviewType: {
      type: String,
      enum: InterviewType,
    },
    InterviewStatus: {
      type: String,
      enum: InterviewStatus,
      default: InterviewStatus.BIDDING,
    },
    interviewDate: {
      type: Schema.Types.Date,
      required: true,
    },
    description: {
      type: String,
    },
    creatorId: {
      type: String,
      required: true,
    },
    talentType: {
      type: String,
      required: true,
      enum: TalentType,
    },
    talentId: {
      type: String,
      required: true,
    },
    intervieweeDateTimeAgreement: {
      type: Boolean,
    },
    interviewBids: {
      type: Map,
      of: {
        _id: {
          type: String,
          default: uuidv4,
          required: true,
        },
        interviewerId: { type: String, ref: "Freelancer", required: true },
        dateTimeAgreement: { type: Boolean, required: true },
        suggestedDateTime: { type: Schema.Types.Date, required: true },
        fee: { type: String, required: true },
        status: {
          type: String,
          enum: BidStatus,
          default: BidStatus.PENDING,
        },
      },
    },
    transaction: {
      type: {
        transactionId: String,
        status: String,
        fee: String,
      },
    },
    rating: {
      type: Number,
      default: 0,
    },
    comments: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const InterviewModel: Model<IInterview> = mongoose.model<IInterview>(
  "Interview",
  InterviewSchema,
);

export default InterviewModel;
