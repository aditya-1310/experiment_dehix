import mongoose, { Schema, Document, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
// const { String } = Schema.Types;

//  Enum for  Business Status
export enum BusinessStatusEnum {
  ACTIVE = "ACTIVE",
  IN_ACTIVE = "IN_ACTIVE",
  NOT_VERIFIED = "NOT_VERIFIED",
}

export enum KycBusinessStatusEnum {
  APPLIED = "APPLIED",
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REUPLOAD = "REUPLOAD",
  STOPPED = "STOPPED",
}

export interface IBusiness extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  companyName: string;
  profilePic: string;
  companySize: string;
  email: string;
  phone: string;
  phoneVerify: boolean;
  status: BusinessStatusEnum;
  kyc: IKycBusiness;
  position?: string;
  refer?: string;
  verified?: any;
  isVerified: boolean;
  linkedin?: string;
  personalWebsite?: string;
  isBusiness: boolean;
  connects: number;
  referral?: {
    referralCode?: string;
    referredBy?: string;
    referredTo?: string[];
    referredCount?: number;
  };
  ProjectList: string[];
}

export interface IKycBusiness extends Document {
  _id: string;
  businessProof: string;
  verification: string;
  frontImageUrl: string;
  backImageUrl: string;
  liveCaptureUrl: string;
  status: KycBusinessStatusEnum;
  createdAt: Date;
  updatedAt: Date;
}

const BusinessSchema: Schema<IBusiness> = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
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
    companyName: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      required: false,
    },
    companySize: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    phoneVerify: {
      type: Boolean,
      required: false,
    },
    status: {
      type: String,
      enum: Object.values(BusinessStatusEnum),
      default: BusinessStatusEnum.NOT_VERIFIED,
    },
    kyc: {
      _id: { type: String, default: uuidv4, required: false },
      businessProof: {
        type: String,
        required: false,
      },
      verification: {
        type: String,
        required: false,
      },
      frontImageUrl: {
        type: String,
        required: false,
      },
      backImageUrl: {
        type: String,
        required: false,
      },
      liveCaptureUrl: {
        type: String,
        required: false,
      },
      status: {
        type: String,
        enum: Object.values(KycBusinessStatusEnum),
        default: KycBusinessStatusEnum.PENDING,
        required: true,
      },
      // createdAt: {
      //   type: Date,
      //   default: () => new Date(),
      //   required: false,
      // },
      // updatedAt: {
      //   type: Date,
      //   default: () => new Date(),
      //   required: false,
      // },
    },
    position: {
      type: String,
      required: false,
    },
    refer: {
      type: String,
      required: false,
    },
    verified: {
      type: Schema.Types.Mixed,
      required: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    linkedin: {
      type: String,
      required: false,
    },
    personalWebsite: {
      type: String,
      required: false,
    },
    isBusiness: {
      type: Boolean,
      default: true,
      required: true,
    },
    connects: {
      type: Number,
      default: 0,
    },
    referral: {
      referralCode: {
        type: String,
        required: false,
      },
      referredBy: {
        type: String,
        required: false,
      },
      referredTo: [
        {
          type: String,
          required: false,
        },
      ],
      referredCount: {
        type: Number,
        required: false,
      },
    },
    ProjectList: [
      {
        type: String,
        ref: "Project",
      },
    ],
  },
  {
    timestamps: true,
  },
);
export const BusinessModel: Model<IBusiness> = mongoose.model<IBusiness>(
  "Business",
  BusinessSchema,
);

export default BusinessModel;
