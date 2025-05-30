import mongoose, { Schema, Document, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const { String } = Schema.Types;

export enum FreelancerStatusEnum {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  INACTIVE = "INACTIVE",
  CLOSED = "CLOSED",
}

export enum FreelancerVerificationStatusEnum {
  ADDED = "ADDED",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
  REAPPLIED = "REAPPLIED",
}

export enum FreelancerInterviewStatusEnum {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  REAPPLIED = "REAPPLIED",
}

export enum FreelancerOracleNdConsultantStatusEnum {
  APPLIED = "APPLIED",
  NOT_APPLIED = "NOT_APPLIED",
  APPROVED = "APPROVED",
  FAILED = "FAILED",
  STOPPED = "STOPPED",
  REAPPLIED = "REAPPLIED",
}

//COMMENTED CODE -> TO BE DECIDED
export enum FreelancerInterviewPermissionEnum {
  NOT_VERIFIED = "NOT_VERIFIED",
  VERIFIED = "VERIFIED",
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
  ADMIN_STOPPED = "ADMIN_STOPPED",
  APPLIED = "APPLIED",
}

export enum TalentTypeEnum {
  SKILL = "SKILL",
  DOMAIN = "DOMAIN",
}
export enum KycStatusEnum {
  APPLIED = "APPLIED",
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REUPLOAD = "REUPLOAD",
  STOPPED = "STOPPED",
}

export enum DehixTalentEnum {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

export interface ISkill extends Document {
  _id: string;
  name: string;
  // level: string;
  // experience: string;
  // interviewStatus?: FreelancerInterviewStatusEnum;
  // interviewInfo?: string;
  // interviewerRating?: number;
  interviewPermission: FreelancerInterviewPermissionEnum;
}
export interface IDomain extends Document {
  _id: string;
  name: string;
  // level: string;
  // experience: string;
  // interviewStatus?: FreelancerInterviewStatusEnum;
  // interviewInfo?: string;
  // interviewerRating?: number;
  interviewPermission: FreelancerInterviewPermissionEnum;
}
export interface IProjectDomain extends Document {
  _id: string;
  name: string;
  level: string;
  experience: string;
  interviewStatus?: FreelancerInterviewStatusEnum;
  interviewInfo?: string;
  interviewerRating?: number;
  interviewPermission: FreelancerInterviewPermissionEnum;
}
export interface IKyc extends Document {
  id: string;
  aadharOrGovtId: string;
  frontImageUrl: string;
  backImageUrl: string;
  liveCaptureUrl: string;
  status: KycStatusEnum;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFreelancer extends Document {
  _id?: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phone: string;
  phoneVerify: boolean;
  dob?: Date;
  profilePic: string;
  description?: string;
  professionalInfo?: Map<
    string,
    {
      _id?: string;
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
  >;
  skills?: ISkill[];
  domain?: IDomain[];
  projectDomain?: IProjectDomain[];
  education?: Map<
    string,
    {
      _id?: string;
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
    }
  >;
  role?: string;
  projects?: Map<
    string,
    {
      _id?: string;
      projectName?: string;
      description?: string;
      verified?: boolean;
      githubLink?: string;
      start?: Date;
      end?: Date;
      refer?: string;
      techUsed?: string[];
      role?: string;
      projectType?: string;
      oracleAssigned?: string;
      verificationStatus?: FreelancerVerificationStatusEnum;
      verificationUpdateTime?: Date;
      comments?: string;
    }
  >;
  dehixTalent?: Map<
    string,
    {
      _id?: string;
      type: TalentTypeEnum;
      talentId?: string;
      talentName?: string;
      level?: string;
      experience?: string;
      monthlyPay?: string;
      status?: DehixTalentEnum;
      activeStatus?: boolean;
      interviewCount?: number;
      education?: Map<
        string,
        {
          _id?: string;
          degree?: string;
          universityName?: string;
          fieldOfStudy?: string;
          startDate?: Date;
          endDate?: Date;
          grade?: string;
        }
      >;
      projects?: Map<
        string,
        {
          _id?: string;
          projectName?: string;
          description?: string;
          verified?: boolean;
          githubLink?: string;
          start?: Date;
          end?: Date;
          refer?: string;
          techUsed?: string[];
          role?: string;
          projectType?: string;
          oracleAssigned?: string;
          verificationStatus?: FreelancerVerificationStatusEnum;
          verificationUpdateTime?: Date;
          comments?: string;
        }
      >;
      verification?: {
        type: TalentTypeEnum;
        proofId: string;
        description: string;
      };
    }
  >;
  dehixInterviewer?: Map<
    string,
    {
      _id?: string;
      type: TalentTypeEnum;
      talentId?: string;
      talentName?: string;
      level?: string;
      experience?: string;
      interviewFees?: string;
      status?: DehixTalentEnum;
      activeStatus?: boolean;
      interviews?: [string];
    }
  >;
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
    description?: string;

    price?: string;

    experience?: string;

    links?: string[];
  };
  pendingProject?: string[];
  rejectedProject?: string[];
  acceptedProject?: string[];
  oracleProject?: string[];
  userDataForVerification?: string[];
  interviewsAligned?: string[];
  interviewee?: boolean;
  notInterestedProject?: string[];
  referral?: {
    referralCode?: string;
    referredBy?: string;
    referredTo?: string[];
    referredCount?: number;
  };
  onboardingStatus?: boolean;
  status?: FreelancerStatusEnum;
}

const FreelancerSchema: Schema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
      required: true,
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
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: false,
    },
    phoneVerify: {
      type: Boolean,
      required: false,
    },
    dob: {
      type: Date,
      required: false,
    },
    profilePic: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
      maxlenght: 500,
    },
    professionalInfo: {
      type: Map,
      of: new Schema({
        _id: {
          type: String,
          default: uuidv4,
          required: true,
        },
        company: { type: String, required: false },
        jobTitle: { type: String, required: false },
        workDescription: { type: String, required: false },
        workFrom: { type: Date, required: false },
        workTo: { type: Date, required: false },
        referencePersonName: { type: String, required: false },
        referencePersonContact: { type: String, required: false },
        githubRepoLink: { type: String, required: false },
        oracleAssigned: {
          type: String,
          ref: "Freelancer",
          required: false,
        },
        verificationStatus: {
          type: String,
          enum: Object.values(FreelancerVerificationStatusEnum),
          default: FreelancerVerificationStatusEnum.ADDED,
          required: false,
        },
        verificationUpdateTime: { type: Date, required: false },
        comments: { type: String, required: false },
      }),
      required: false,
    },
    skills: [
      {
        _id: {
          type: String,
          default: uuidv4,
          required: true,
        },
        name: { type: String, required: true },
        skillId: {
          type: String,
          default: uuidv4,
          required: true,
        },
        level: { type: String, required: true },
        experience: { type: String, required: false },

        // interviewStatus: {
        //   type: String,
        //   enum: Object.values(FreelancerInterviewStatusEnum),
        //   default: FreelancerInterviewStatusEnum.PENDING,
        //   required: false,
        // },
        // interviewInfo: {
        //   type: String,
        //   ref: "Interview",
        //   required: false,
        // },
        // interviewerRating: { type: Number, required: false },
        // interviewPermission: {
        //   type: String,
        //   enum: Object.values(FreelancerInterviewPermissionEnum),
        //   default: FreelancerInterviewPermissionEnum.NOT_VERIFIED,
        //   required: true,
        // },
      },
    ],
    domain: [
      {
        _id: {
          type: String,
          default: uuidv4,
          required: true,
        },
        name: { type: String, required: true },
        level: { type: String, required: true },
        experience: { type: String, required: false },
        interviewStatus: {
          type: String,
          enum: Object.values(FreelancerInterviewStatusEnum),
          default: FreelancerInterviewStatusEnum.PENDING,
          required: false,
        },
        interviewInfo: {
          type: String,
          ref: "Interview",
          required: false,
        },
        interviewerRating: { type: Number, required: false },
        interviewPermission: {
          type: String,
          enum: Object.values(FreelancerInterviewPermissionEnum),
          default: FreelancerInterviewPermissionEnum.NOT_VERIFIED,
          required: true,
        },
      },
    ],
    projectDomain: [
      {
        _id: {
          type: String,
          default: uuidv4,
          required: true,
        },
        name: { type: String, required: false },
        level: { type: String, required: false },
        experience: { type: String, required: false },
        // interviewStatus: {
        //   type: String,
        //   enum: Object.values(FreelancerInterviewStatusEnum),
        //   default: FreelancerInterviewStatusEnum.PENDING,
        //   required: false,
        // },
        // interviewInfo: {
        //   type: String,
        //   ref: "Interview",
        //   required: false,
        // },
        // interviewerRating: { type: Number, required: false },
        // interviewPermission: {
        //   type: String,
        //   enum: Object.values(FreelancerInterviewPermissionEnum),
        //   default: FreelancerInterviewPermissionEnum.NOT_VERIFIED,
        //   required: true,
        // },
      },
    ],
    education: {
      type: Map,
      of: new Schema({
        _id: { type: String, default: uuidv4, required: true },
        degree: { type: String, required: false },
        universityName: { type: String, required: false },
        fieldOfStudy: { type: String, required: false },
        startDate: { type: Date, required: false },
        endDate: { type: Date, required: false },
        grade: { type: String, required: false },
        oracleAssigned: {
          type: String,
          ref: "Freelancer",
          required: false,
        },
        verificationStatus: {
          type: String,
          enum: Object.values(FreelancerVerificationStatusEnum),
          default: FreelancerVerificationStatusEnum.ADDED,
          required: false,
        },
        verificationUpdateTime: { type: Date, required: false },
        comments: { type: String, required: false },
      }),
      require: false,
    },
    role: {
      type: String,
      required: false,
    },
    projects: {
      type: Map,
      of: new Schema({
        _id: { type: String, default: uuidv4, required: true },
        projectName: { type: String, required: true },
        description: { type: String, required: true },
        verified: { type: Schema.Types.Mixed },
        githubLink: { type: String, required: true },
        start: { type: Date },
        end: { type: Date },
        refer: { type: String, required: true },
        techUsed: [{ type: String, required: true }],
        role: { type: String, required: true },
        projectType: { type: String },
        oracleAssigned: {
          type: String,
          ref: "Freelancer",
        },
        verificationStatus: {
          type: String,
          enum: Object.values(FreelancerVerificationStatusEnum),
          default: FreelancerVerificationStatusEnum.ADDED,
        },
        verificationUpdateTime: { type: Date },
        comments: { type: String },
      }),
      require: false,
    },
    dehixTalent: {
      type: Map,
      of: new Schema({
        _id: {
          type: String,
          default: uuidv4,
          required: true,
        },
        type: {
          type: String,
          enum: Object.values(TalentTypeEnum),
          require: true,
        },
        talentId: { type: String, require: true },
        talentName: { type: String, require: true },
        experience: { type: String, require: true },
        monthlyPay: { type: String, require: true },
        level: { type: String, require: true },
        status: {
          type: String,
          enum: Object.values(DehixTalentEnum),
          required: false,
          default: "pending",
        },
        interviews: {
          type: [String],
        },
        activeStatus: {
          type: Boolean,
        },
      }),
      required: false,
    },
    dehixInterviewer: {
      type: Map,
      of: new Schema({
        _id: {
          type: String,
          default: uuidv4,
          required: true,
        },
        type: {
          type: String,
          enum: Object.values(TalentTypeEnum),
          require: true,
        },
        talentId: { type: String, require: true },
        talentName: { type: String, require: true },
        experience: { type: String, require: true },
        interviewFees: { type: String, require: true },
        level: { type: String, require: true },
        status: {
          type: String,
          enum: Object.values(DehixTalentEnum),
          required: false,
          default: "pending",
        },
        interviews: {
          type: [String],
        },
        activeStatus: {
          type: Boolean,
        },
      }),
      required: false,
    },
    refer: {
      name: { type: String, required: false },
      contact: { type: String, required: false },
    },
    githubLink: { type: String, required: false },
    linkedin: { type: String, required: false },
    personalWebsite: { type: String, required: false },
    perHourPrice: { type: Number, required: false },
    connects: { type: Number, default: 100 },
    resume: { type: String, required: false },
    workExperience: { type: Number, required: false },
    isFreelancer: { type: Boolean, default: true, required: true },
    oracleStatus: {
      type: String,
      enum: Object.values(FreelancerOracleNdConsultantStatusEnum),
      default: FreelancerOracleNdConsultantStatusEnum.NOT_APPLIED,
      required: false,
    },
    consultant: {
      type: Map,
      of: new Schema({
        _id: { type: String },
        status: {
          type: String,
          enum: Object.values(FreelancerOracleNdConsultantStatusEnum),
          default: FreelancerOracleNdConsultantStatusEnum.NOT_APPLIED,
          required: false,
        },
        description: {
          type: String,
          required: false,
        },
        price: {
          type: String,
          required: false,
        },
        experience: {
          type: String,
          required: false,
        },
        links: {
          type: [String],
          required: false,
        },
      }),
    },
    pendingProject: [{ type: String, ref: "Project", required: false }],
    rejectedProject: [{ type: String, ref: "Project", required: false }],
    acceptedProject: [{ type: String, ref: "Project", required: false }],
    oracleProject: [{ type: String, ref: "Project", required: false }],
    userDataForVerification: [
      { type: String, ref: "Verification", required: false },
    ],
    interviewsAligned: [{ type: String, ref: "Interview", required: false }],
    interviewee: {
      type: Boolean,
      default: false,
      require: false,
    },
    notInterestedProject: [
      {
        type: String,
      },
    ],
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
    onboardingStatus: {
      type: Boolean,
      default: false,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(FreelancerStatusEnum),
      default: FreelancerStatusEnum.PENDING,
    },
    kyc: {
      _id: { type: String, default: uuidv4, required: false },
      aadharOrGovtId: {
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
      liveCapture: {
        type: String,
        required: false,
      },
      status: {
        type: String,
        enum: Object.values(KycStatusEnum),
        default: KycStatusEnum.PENDING,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date,
        required: false,
      },
      updatedAt: {
        type: Date,
        default: Date,
        required: false,
      },
    },
  },
  {
    timestamps: true,
  },
);

export const FreelancerModel: Model<IFreelancer> = mongoose.model<IFreelancer>(
  "Freelancer",
  FreelancerSchema,
);
