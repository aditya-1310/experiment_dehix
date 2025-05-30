import {
  FreelancerInterviewStatusEnum,
  FreelancerOracleNdConsultantStatusEnum,
  FreelancerVerificationStatusEnum,
} from "../../../models/freelancer.entity";

export interface PutFreelancerBody {
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  email: string;
  phone: string;
  phoneVerify: boolean;
  dob?: Date;
  profilePic?: string;
  professionalInfo?: {
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
  }[];
  skills?: {
    name: string;
    level: string;
    experience: string;
    interviewStatus?: FreelancerInterviewStatusEnum;
    interviewInfo?: string;
    interviewerRating?: number;
  }[];
  domain?: {
    name: string;
    level: string;
    experience: string;
    interviewStatus?: FreelancerInterviewStatusEnum;
    interviewInfo?: string;
    interviewerRating?: number;
  }[];
  projectDomain?: {
    name: string;
    level: string;
    experience: string;
    interviewStatus?: FreelancerInterviewStatusEnum;
    interviewInfo?: string;
    interviewerRating?: number;
  }[];
  education?: {
    degree?: string;
    universityName?: string;
    fieldOfStudy?: string;
    startDate?: Date;
    endDate?: Date;
    grade?: string;
    oracleAssigned?: string;
    verificationStatus?: FreelancerVerificationStatusEnum;
    verificationUpdateTime?: Date;
    comments?: string;
  }[];
  role?: string;
  projects?: {
    [key: string]: {
      _id: string;
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
      oracleAssigned?: string;
      verificationStatus: FreelancerVerificationStatusEnum;
      verificationUpdateTime: Date;
      comments: string;
    };
  };
  refer?: {
    name?: string;
    contact?: string;
  };
  githubLink?: string;
  linkedin?: string;
  personalWebsite?: string;
  perHourPrice?: number;
  connects?: number;
  resume?: string;
  workExperience?: number;
  isFreelancer?: boolean;
  oracleStatus?: FreelancerOracleNdConsultantStatusEnum;
  consultant?: {
    status: FreelancerOracleNdConsultantStatusEnum;
  };
  pendingProject?: string[];
  rejectedProject?: string[];
  acceptedProject?: string[];
  oracleProject?: string[];
  userDataForVerification?: string[];
  interviewsAligned?: string[];
}

export interface PutFreelancerSkillsBody {
  skills: string[];
}
export interface PutFreelancerDomainBody {
  domain: string[];
}
export interface PutFreelancerOracleStatusBody {
  oracleStatus: FreelancerOracleNdConsultantStatusEnum;
}

export interface PutFreelancerInterviewsAlignedBody {
  interviewsAligned: string[];
}

export interface PutFreelancerExperinceBody {
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
export interface PutExperincePathParams {
  experience_id: string;
}

export interface PutFreelancerEducationBody {
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
export interface PutEducationPathParams {
  education_id: string;
}

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
  oracleAssigned?: string;
  verificationStatus: FreelancerVerificationStatusEnum;
  verificationUpdateTime: Date;
  comments: string;
}

export interface PutProjectPathParams {
  project_id: string;
}

export interface PutFreelancerOnboardingStatusBody {
  onboardingStatus: string;
}
