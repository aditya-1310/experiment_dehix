import { StatusEnum } from "../../../models/project.entity";

export interface PutProjectPathParams {
  business_id: string;
  project_id: string;
}
export interface PutProjectBody {
  _id: string;
  projectName: string;
  projectDomain: string[];
  description: string;
  email: string;
  verified?: any;
  isVerified?: string;
  companyName: string;
  start?: Date;
  end?: Date;
  skillsRequired: string[];
  experience?: string;
  role: string;
  projectType: string;
  totalNeedOfFreelancer?: {
    category?: string;
    needOfFreelancer?: number;
    appliedCandidates?: string[];
    rejected?: string[];
    accepted?: string[];
    status?: string;
  }[];
  status?: StatusEnum;
  team?: string[];
}

export interface PutStatusProjectBody {
  status: StatusEnum;
}
export interface PutBiddingDateProjectBody {
  maxBiddingDate: Date;
  startBiddingDate: Date;
}
