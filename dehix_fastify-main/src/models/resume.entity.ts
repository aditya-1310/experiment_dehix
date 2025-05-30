import mongoose, { Schema, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ResumeDocument {
  _id?: string;
  userId: string;
  personalInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city?: string;
    country?: string;
    linkedin?: string;
    github?: string;
  };
  workExperience?: Array<{
    jobTitle?: string;
    company?: string;
    startDate?: Date;
    endDate?: Date;
    description?: string;
  }>;
  education?: Array<{
    degree?: string;
    school?: string;
    startDate?: Date;
    endDate?: Date;
    grade?: string;
  }>;

  skills?: string[];
  certifications?: Array<{
    name?: string;
    issuingOrganization?: string;
    issueDate?: Date;
    expirationDate?: Date;
  }>;
  professionalSummary?: string;
  projects?: Array<{
    title?: string;
    description?: string;
  }>;
  selectedTemplate?: string;
  selectedColor?: string;
}

const resumeSchema: Schema<ResumeDocument> = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    userId: { type: String, required: true },
    personalInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      city: { type: String },
      country: { type: String },
      linkedin: { type: String },
      github: { type: String },
    },
    workExperience: [
      {
        jobTitle: { type: String, required: true },
        company: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        description: { type: String, required: true },
      },
    ],
    education: [
      {
        degree: { type: String, required: true },
        school: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        grade: { type: String },
      },
    ],

    skills: { type: [String], required: true },
    certifications: [
      {
        name: { type: String },
        issuingOrganization: { type: String },
        issueDate: { type: String },
        expirationDate: { type: String },
      },
    ],
    professionalSummary: { type: String, required: true },
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    selectedTemplate: { type: String },
  },
  { timestamps: true },
);

// Create and export Resume model
const ResumeModel: Model<ResumeDocument> = mongoose.model<ResumeDocument>(
  "Resume",
  resumeSchema,
);
export default ResumeModel;
