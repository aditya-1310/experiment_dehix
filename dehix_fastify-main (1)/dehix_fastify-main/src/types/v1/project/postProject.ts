export interface getProjectPathParams {
  project_id: string;
  freelancer_id: string;
}
export interface PostBusinessProjectBody {
  _id: string;
  projectName: string;
  projectDomain: string[];
  description: string;
  companyId: string;
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
  profiles?: {
    domain?: string;
    freelancersRequired?: string;
    skills?: string[];
    experience?: number;
    minConnect?: number;
    rate?: number;
    description?: string;
    domain_id?: string;
  }[];
  status?: "Active" | "Pending" | "Completed" | "Rejected";
  team?: string[];
}
