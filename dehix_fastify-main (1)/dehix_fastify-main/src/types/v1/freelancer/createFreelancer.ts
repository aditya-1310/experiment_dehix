import {
  FreelancerInterviewStatusEnum,
  FreelancerOracleNdConsultantStatusEnum,
  FreelancerVerificationStatusEnum,
  TalentTypeEnum,
} from "../../../models/freelancer.entity";

interface ProfessionalInfo {
  company: string;
  jobTitle: string;
  workDescription: string;
  workFrom: string;
  workTo: string;
  referencePersonName: string;
  referencePersonContact: string;
  githubRepoLink: string;
  oracleAssigned: string;
  verificationStatus: FreelancerVerificationStatusEnum;
  verificationUpdateTime: string;
  comments: string;
}

interface Skill {
  name: string;
  level: string;
  experience: string;
  interviewStatus: FreelancerInterviewStatusEnum;
  interviewInfo: null | any;
  interviewerRating: number;
}

interface Education {
  degree: string;
  universityName: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  grade: string;
  oracleAssigned: string;
  verificationStatus: FreelancerVerificationStatusEnum;
  verificationUpdateTime: string;
  comments: string;
}

interface Project {
  projectName: string;
  description: string;
  verified: any;
  githubLink: string;
  start: string;
  end: string;
  refer: string;
  techUsed: string[];
  role: string;
  projectType: string;
  oracleAssigned: string;
  verificationStatus: FreelancerVerificationStatusEnum;
  verificationUpdateTime: string;
  comments: string;
}

interface Refer {
  name: string;
  contact: string;
}

interface Consultant {
  status: FreelancerOracleNdConsultantStatusEnum;
}

export interface CreateFreelancerBody {
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  email: string;
  phone: string;
  phoneVerify: boolean;
  dob: string;
  profilePic: string;
  professionalInfo: ProfessionalInfo[];
  skills: Skill[];
  education: Education[];
  role: string;
  projects: { [key: string]: Project };
  refer: Refer;
  githubLink: string;
  linkedin: string;
  personalWebsite: string;
  perHourPrice: number;
  connects: number;
  resume: null | any;
  workExperience: number;
  isFreelancer: boolean;
  oracleStatus: FreelancerOracleNdConsultantStatusEnum;
  consultant: Consultant[];
  pendingProject: any[];
  rejectedProject: any[];
  acceptedProject: any[];
  oracleProject: any[];
  userDataForVerification: any[];
  interviewsAligned: any[];
}

export interface CreateFreelancerExperienceBody {
  company?: string;
  jobTitle?: string;
  workDescription?: string;
  workFrom?: Date;
  workTo?: Date;
  referencePersonName?: string;
  referencePersonContact?: string;
  githubRepoLink?: string;
  oracleAssigned?: string;
  verificationStatus?: FreelancerVerificationStatusEnum;
  verificationUpdateTime?: Date;
  comments?: string;
}

export interface CreateFreelancerEducationBody {
  degree?: string;
  universityName?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  grade?: string;
  oracleAssigned?: string;
  verificationStatus?: FreelancerVerificationStatusEnum;
  verificationUpdateTime?: string;
  comments?: string;
}

export interface CreateFreelancerProjectBody {
  projectName: string;
  description: string;
  verified: any;
  githubLink: string;
  start: string;
  end: string;
  refer: string;
  techUsed: string[];
  role: string;
  projectType: string;
  oracleAssigned: string;
  verificationStatus: FreelancerVerificationStatusEnum;
  verificationUpdateTime: string;
  comments: string;
}

export interface PostConsultantBody {
  status: FreelancerOracleNdConsultantStatusEnum;
  description: string;
  price: number;
  experience: string;
  links: string[];
}

export interface CreateDehixTalentBody {
  type: TalentTypeEnum;
  talentId: string;
  talentName: string;
  level?: string;
  experience?: string;
  monthlyPay?: string;
  status?: "pending" | "verified" | "rejected";
  activeStatus?: boolean;
}

export interface CreateDehixInterviewerBody {
  type: TalentTypeEnum;
  talentId: string;
  talentName: string;
  level?: string;
  experience?: string;
  interviewFees?: string;
  status?: "PENDING" | "VERIFIED" | "REJECTED";
  activeStatus?: boolean;
}
