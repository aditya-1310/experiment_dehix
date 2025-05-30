import mongoose, { Schema, Document, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

// Enum for Hire Talent Status
export enum HireDehixTalentStatusEnum {
  ADDED = "ADDED",
  APPROVED = "APPROVED",
  CLOSED = "CLOSED",
  COMPLETED = "COMPLETED",
}

export enum FreelancerInvitedStatusEnum {
  INVITED = "INVITED",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export interface IHire extends Document {
  _id: string;
  businessId: string;
  domainId: string;
  domainName: string;
  skillId: string;
  skillName: string;
  description: string;
  experience: string;
  status: HireDehixTalentStatusEnum;
  visible: boolean;
  bookmarked: boolean;
  freelancerRequired: number;
  freelancerInLobby: {
    _id: string;
    freelancerId: string;
    dehixTalentId: string;
  }[];
  freelancerInvited: {
    _id: string;
    freelancerId: string;
    status: FreelancerInvitedStatusEnum;
  }[];
  freelancerSelected: {
    _id: string;
    freelancerId: string;
    dehixTalentId: string;
  }[];
  freelancerRejected: {
    _id: string;
    freelancerId: string;
    dehixTalentId: string;
  }[];
}

// Define the Hire schema
const hireSchema: Schema<IHire> = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4, // Use uuidv4 for generating unique IDs
      required: true,
    },
    businessId: {
      type: String,
      ref: "Business",
      required: true,
    },
    domainId: {
      type: String,
      ref: "Domain",
      required: false,
    },
    domainName: {
      type: String,
      ref: "Domain",
      required: false,
    },
    skillId: {
      type: String,
      ref: "Skill",
      required: false,
    },
    skillName: {
      type: String,
      ref: "Skill",
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(HireDehixTalentStatusEnum),
      default: HireDehixTalentStatusEnum.ADDED,
    },
    visible: {
      type: Boolean,
    },
    bookmarked: {
      type: Boolean,
      default: false,
    },
    freelancerRequired: {
      type: Number,
      default: 1,
      required: false,
    },
    freelancerInLobby: [
      {
        _id: {
          type: String,
          default: uuidv4,
          required: true,
        },
        freelancerId: {
          type: String,
          ref: "Freelancer",
        },
        dehixTalentId: {
          type: String,
        },
      },
    ],
    freelancerInvited: [
      {
        _id: {
          type: String,
          default: uuidv4,
          required: true,
        },
        freelancerId: {
          type: String,
          ref: "Freelancer",
        },
        status: {
          type: String,
          enum: Object.values(FreelancerInvitedStatusEnum),
          default: FreelancerInvitedStatusEnum.INVITED,
        },
      },
    ],
    freelancerSelected: [
      {
        _id: {
          type: String,
          default: uuidv4,
          required: true,
        },
        freelancerId: {
          type: String,
          ref: "Freelancer",
        },
        dehixTalentId: {
          type: String,
        },
      },
    ],
    freelancerRejected: [
      {
        _id: {
          type: String,
          default: uuidv4,
          required: true,
        },
        freelancerId: {
          type: String,
          ref: "Freelancer",
        },
        dehixTalentId: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true, // Add createdAt and updatedAt fields
    versionKey: false, // Disable __v versioning field
  },
);

// Create and export the Hire model
export const HireModel: Model<IHire> = mongoose.model<IHire>(
  "Hire",
  hireSchema,
);

export default {
  HireModel,
};
