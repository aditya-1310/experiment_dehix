import mongoose, { Schema, Document, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

// Enums for Status and ProjectType
export enum StatusEnum {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
}

export enum ProjectTypeEnum {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  FREELANCE = "FREELANCE",
}

// Define an interface for the Project document
export interface IProject extends Document {
  _id: string;
  projectName: string;
  projectDomain: string[];
  description: string;
  companyId: string;
  email: string;
  url?: { value: string }[];
  verified?: any;
  isVerified?: string;
  companyName: string;
  start: {
    expected: Date;
    actual?: Date;
  };
  end: {
    expected: Date;
    actual?: Date;
  };
  skillsRequired: string[];
  experience?: string;
  role?: string;
  projectType?: ProjectTypeEnum;
  profiles?: IProfile[];
  status?: StatusEnum;
  team?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  maxBidDate?: Date;
  startBidDate?: Date;
  milestones?: string[];
}

// Define an interface for the Profiles sub-document
export interface IProfile {
  id?: string;
  domain?: string;
  freelancersRequired?: string;
  skills?: string[];
  experience?: number;
  minConnect?: number;
  rate?: number;
  description?: string;
  domain_id: string;
  selectedFreelancer?: {
    name: string;
    id: string;
  }[]; // add name and id of freelancer
  freelancers?: {
    freelancerId: string;
    bidId: string;
  }[];
  totalBid?: string[];
}

// Define the Project schema
const ProjectSchema: Schema<IProject> = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    projectName: {
      type: String,
      required: [true, "Project name is required"],
    },
    projectDomain: {
      type: [String],
      required: [true, "At least one project domain is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    companyId: {
      type: String,
      required: [true, "Company ID is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: {
        validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: "Invalid email format",
      },
    },
    url: [
      {
        value: { type: String },
      },
    ],
    verified: {
      type: Schema.Types.Mixed,
    },
    isVerified: {
      type: String,
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
    },
    start: {
      type: Date,
    },
    end: {
      type: Date,
      default: null,
    },
    skillsRequired: {
      type: [String],
      required: [true, "At least one skill is required"],
    },
    experience: {
      type: String,
    },
    role: {
      type: String,
    },
    projectType: {
      type: String,
      enum: Object.values(ProjectTypeEnum),
    },
    maxBidDate: {
      type: Date,
      required: false,
      validate: {
        validator: function (value: Date) {
          return value > new Date();
        },
        message: "maxBidDate must be in the future",
      },
    },
    startBidDate: {
      type: Date,
      required: false,
    },
    profiles: [
      {
        _id: {
          type: String,
          default: uuidv4,
        },
        domain: { type: String },
        freelancersRequired: { type: String },
        skills: { type: [String] },
        experience: { type: Number, min: 0 },
        minConnect: { type: Number, min: 0 },
        rate: { type: Number, min: 0 },
        description: { type: String },
        domain_id: {
          type: String,
          required: [true, "Domain ID is required"],
        },
        selectedFreelancer: {
          type: [String],
        },
        freelancers: [
          {
            freelancerId: { type: String, required: true },
            bidId: { type: String, required: true },
          },
        ],
        totalBid: { type: [String] },
      },
    ],
    status: {
      type: String,
      enum: Object.values(StatusEnum),
      default: StatusEnum.PENDING,
    },
    team: {
      type: [String],
      default: [],
    },
    milestones: {
      type: [String], // Array of strings
      default: [], // Default to an empty array
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
    versionKey: false, // Removes __v field
  },
);

// Create and export the Project model
export const ProjectModel: Model<IProject> = mongoose.model<IProject>(
  "Project",
  ProjectSchema,
);

export default {
  ProjectModel,
};
