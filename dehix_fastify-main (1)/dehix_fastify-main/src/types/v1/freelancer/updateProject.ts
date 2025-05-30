import { FreelancerVerificationStatusEnum } from "../../../models/freelancer.entity";

export interface PutFreelancerProjectBody {
  projectName: string;
  description: string;
  verified: boolean;
  githubLink: string;
  start: Date;
  end: Date;
  refer: string;
  techUsed: string[];
  role: string;
  projectType: string;
  oracleAssigned: string;
  verificationStatus: FreelancerVerificationStatusEnum;
  verificationUpdateTime: Date;
  comments: string;
}
