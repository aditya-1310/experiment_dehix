import { FastifySchema } from "fastify";
import {
  FreelancerInterviewPermissionEnum,
  FreelancerInterviewStatusEnum,
  FreelancerOracleNdConsultantStatusEnum,
  FreelancerVerificationStatusEnum,
  KycStatusEnum,
  TalentTypeEnum,
  FreelancerStatusEnum,
  DehixTalentEnum,
} from "../../../models/freelancer.entity";
import { commonErrorResponses } from "../commonErrorCodes";

export const createFreelancerSchema: FastifySchema = {
  description: "API to create a freelancer",
  tags: ["Register"],
  querystring: {
    type: "object",
    properties: {
      referralCode: {
        type: "string",
        nullable: true, // This makes it optional
      },
    },
  },
  body: {
    type: "object",
    properties: {
      firstName: { type: "string" },
      lastName: { type: "string" },
      userName: { type: "string" },
      email: { type: "string" },
      password: { type: "string" },
      phone: { type: "string" },
      phoneVerify: { type: "boolean" },
      dob: { type: "string", format: "date-time" },
      profilePic: { type: "string" },
      professionalInfo: {
        type: "object",
        properties: {
          id: { type: "string" },
          company: { type: "string" },
          jobTitle: { type: "string" },
          workDescription: { type: "string" },
          workFrom: { type: "string", format: "date-time" },
          workTo: { type: "string", format: "date-time" },
          referencePersonName: { type: "string" },
          referencePersonContact: { type: "string" },
          githubRepoLink: { type: "string" },
          oracleAssigned: { type: "string" },
          verificationStatus: {
            type: "string",
            enum: Object.values(FreelancerVerificationStatusEnum),
          },
          verificationUpdateTime: { type: "string", format: "date-time" },
          comments: { type: "string" },
        },
      },
      skills: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            level: { type: "string" },
            experience: { type: "string" },
            interviewStatus: {
              type: "string",
              enum: Object.values(FreelancerInterviewStatusEnum),
              default: FreelancerInterviewStatusEnum.PENDING,
            },
            interviewInfo: { type: "string" },
            interviewerRating: { type: "number" },
            interviewPermission: {
              type: "string",
              enum: Object.values(FreelancerInterviewPermissionEnum),
              default: FreelancerInterviewPermissionEnum.NOT_VERIFIED,
            },
          },
          required: [
            "name",
            "level",
            "experience",
            "interviewStatus",
            "interviewInfo",
            "interviewerRating",
          ],
        },
      },
      domain: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            level: { type: "string" },
            experience: { type: "string" },
            interviewStatus: {
              type: "string",
              enum: Object.values(FreelancerInterviewStatusEnum),
              default: FreelancerInterviewStatusEnum.PENDING,
            },
            interviewInfo: { type: "string" },
            interviewerRating: { type: "number" },
            interviewPermission: {
              type: "string",
              enum: Object.values(FreelancerInterviewPermissionEnum),
              default: FreelancerInterviewPermissionEnum.NOT_VERIFIED,
            },
          },
          required: [
            "name",
            "level",
            "experience",
            "interviewStatus",
            "interviewInfo",
            "interviewerRating",
          ],
        },
      },
      education: {
        type: "object",
        properties: {
          id: { type: "string" },
          degree: { type: "string" },
          universityName: { type: "string" },
          fieldOfStudy: { type: "string" },
          startDate: { type: "string", format: "date-time" },
          endDate: { type: "string", format: "date-time" },
          grade: { type: "string" },
          oracleAssigned: { type: "string" },
          verificationStatus: {
            type: "string",
            enum: Object.values(FreelancerVerificationStatusEnum),
          },
          verificationUpdateTime: { type: "string", format: "date-time" },
          comments: { type: "string" },
        },
      },
      role: { type: "string" },
      projects: {
        type: "object",
        additionalProperties: {
          type: "object",
          properties: {
            projectName: { type: "string" },
            description: { type: "string" },
            verified: { type: "boolean" },
            githubLink: { type: "string" },
            start: { type: "string", format: "date-time" },
            end: { type: "string", format: "date-time" },
            refer: { type: "string" },
            techUsed: {
              type: "array",
              items: { type: "string" },
            },
            role: { type: "string" },
            projectType: { type: "string" },
            oracleAssigned: { type: "string" },
            verificationStatus: {
              type: "string",
              enum: Object.values(FreelancerVerificationStatusEnum),
              default: FreelancerVerificationStatusEnum.ADDED,
            },
            verificationUpdateTime: { type: "string", format: "date-time" },
            comments: { type: "string" },
          },
          required: [
            "projectName",
            "description",
            "verified",
            "githubLink",
            "start",
            "end",
            "refer",
            "techUsed",
            "role",
            "projectType",
            "oracleAssigned",
            "verificationStatus",
            "verificationUpdateTime",
          ],
        },
      },
      dehixTalent: {
        type: "object",
        properties: {
          id: { type: "string" },
          skillId: { type: "string" },
          skillName: { type: "string" },
          domainId: { type: "string" },
          domainName: { type: "string" },
          status: {
            type: "string",
            enum: ["added", "verified", "rejected"],
          },
          activeStatus: {
            type: "string",
            enum: ["Active", "Inactive"],
          },
        },
        required: [],
      },
      refer: {
        type: "object",
        properties: {
          name: { type: "string" },
          contact: { type: "string" },
        },
        required: ["name", "contact"],
      },
      githubLink: { type: "string" },
      linkedin: { type: "string" },
      personalWebsite: { type: "string" },
      perHourPrice: { type: "number" },
      connects: { type: "number" },
      resume: { type: "string" },
      workExperience: { type: "number" },
      isFreelancer: { type: "boolean" },
      oracleStatus: {
        type: "string",
        enum: Object.values(FreelancerOracleNdConsultantStatusEnum),
        default: FreelancerOracleNdConsultantStatusEnum.NOT_APPLIED,
      },
      consultant: {
        type: "object",
        properties: {
          status: {
            type: "string",
            enum: Object.values(FreelancerOracleNdConsultantStatusEnum),
            default: FreelancerOracleNdConsultantStatusEnum.NOT_APPLIED,
          },
        },
        required: ["status"],
      },
      pendingProject: {
        type: "array",
        items: { type: "string" },
      },
      rejectedProject: {
        type: "array",
        items: { type: "string" },
      },
      acceptedProject: {
        type: "array",
        items: { type: "string" },
      },
      oracleProject: {
        type: "array",
        items: { type: "string" },
      },
      userDataForVerification: {
        type: "array",
        items: { type: "string" },
      },
      interviewsAligned: {
        type: "array",
        items: { type: "string" },
      },
      referral: {
        type: "object",
        default: {},
        properties: {
          referralCode: { type: "string" },
          referredBy: { type: "string" },
          referredTo: {
            type: "array",
            items: { type: "string" },
          },
          referredCount: { type: "number" },
        },
        required: [],
      },
      onboardingStatus: {
        type: "boolean",
        default: false,
      },
    },
    required: [
      "firstName",
      "lastName",
      "userName",
      "password",
      "email",
      "phone",
      "dob",
      "skills",
      "role",
      "refer",
      "githubLink",
      "linkedin",
      "personalWebsite",
      "perHourPrice",
      "connects",
      "resume",
      "isFreelancer",
      "oracleStatus",
      "pendingProject",
      "rejectedProject",
      "acceptedProject",
      "oracleProject",
      "userDataForVerification",
      "interviewsAligned",
    ],
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            _id: { type: "string" },
            email: { type: "string" },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const createProfessionalInfoSchema: FastifySchema = {
  description: "API to create professional information for freelancer",
  tags: ["Freelancer"],
  body: {
    type: "object",
    properties: {
      company: { type: "string" },
      jobTitle: { type: "string" },
      workDescription: { type: "string" },
      workFrom: { type: "string", format: "date-time" },
      workTo: { type: "string", format: "date-time" },
      referencePersonName: { type: "string" },
      referencePersonContact: { type: "string" },
      githubRepoLink: { type: "string" },
      oracleAssigned: { type: "string" },
      verificationStatus: {
        type: "string",
        enum: Object.values(FreelancerVerificationStatusEnum),
        default: FreelancerVerificationStatusEnum.ADDED,
      },
      comments: { type: "string" },
    },
    required: [
      "company",
      "jobTitle",
      "workDescription",
      "workFrom",
      "workTo",
      "referencePersonName",
      "referencePersonContact",
      "githubRepoLink",
    ],
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            _id: { type: "string", format: "uuid" },
            company: { type: "string" },
            jobTitle: { type: "string" },
            workDescription: { type: "string" },
            workFrom: { type: "string", format: "date-time" },
            workTo: { type: "string", format: "date-time" },
            referencePersonName: { type: "string" },
            referencePersonContact: { type: "string" },
            githubRepoLink: { type: "string" },
            oracleAssigned: { type: "string" },
            verificationStatus: {
              type: "string",
              enum: Object.values(FreelancerVerificationStatusEnum),
            },
            verificationUpdateTime: { type: "string", format: "date-time" },
            comments: { type: "string" },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const createEducationSchema: FastifySchema = {
  description: "API to create education information for freelancer",
  tags: ["Freelancer"],
  body: {
    type: "object",
    properties: {
      degree: { type: "string" },
      universityName: { type: "string" },
      fieldOfStudy: { type: "string" },
      startDate: { type: "string", format: "date-time" },
      endDate: { type: "string", format: "date-time" },
      grade: { type: "string" },
      oracleAssigned: { type: "string" },
      verificationStatus: {
        type: "string",
        enum: Object.values(FreelancerVerificationStatusEnum),
        default: FreelancerVerificationStatusEnum.ADDED,
      },
      verificationUpdateTime: { type: "string", format: "date-time" },
      comments: { type: "string" },
    },
    required: [
      "degree",
      "universityName",
      "fieldOfStudy",
      "startDate",
      "endDate",
      "grade",
      "oracleAssigned",
      "verificationStatus",
      "verificationUpdateTime",
    ],
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            _id: { type: "string", format: "uuid" },
            degree: { type: "string" },
            universityName: { type: "string" },
            fieldOfStudy: { type: "string" },
            startDate: { type: "string", format: "date-time" },
            endDate: { type: "string", format: "date-time" },
            grade: { type: "string" },
            oracleAssigned: { type: "string" },
            verificationStatus: {
              type: "string",
              enum: Object.values(FreelancerVerificationStatusEnum),
            },
            verificationUpdateTime: { type: "string", format: "date-time" },
            comments: { type: "string" },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const createProjectSchema: FastifySchema = {
  description: "API to add project to freelancer",
  tags: ["Freelancer"],
  body: {
    type: "object",
    properties: {
      projectName: { type: "string", description: "The name of the project" },
      description: {
        type: "string",
        description: "A description of the project",
      },
      verified: {
        type: "boolean",
        description: "A boolean indicating whether the project is verified",
      },
      githubLink: {
        type: "string",
        description: "A link to the project's GitHub repository",
        format: "uri",
      },
      start: {
        type: "string",
        description: "The start date of the project",
        format: "date-time",
      },
      end: {
        type: "string",
        description: "The end date of the project",
        format: "date-time",
      },
      refer: {
        type: "string",
        description: "A reference string for the project",
      },
      techUsed: {
        type: "array",
        description:
          "An array of strings listing the technologies used in the project",
        items: { type: "string" },
      },
      role: {
        type: "string",
        description: "The role of the freelancer in the project",
      },
      projectType: { type: "string", description: "The type of the project" },
      oracleAssigned: {
        type: "string",
        description: "The ObjectId of the oracle assigned to the project",
        nullable: true,
      },
      verificationStatus: {
        type: "string",
        description: "The current verification status of the project",
        enum: Object.values(FreelancerVerificationStatusEnum),
        default: FreelancerVerificationStatusEnum.ADDED,
      },
      verificationUpdateTime: {
        type: "string",
        description:
          "The date and time when the verification status was last updated",
        format: "date-time",
      },
      comments: {
        type: "string",
        description: "Any comments related to the project",
      },
    },
    required: [
      "projectName",
      "description",
      "verified",
      "githubLink",
      "start",
      "end",
      "refer",
      "techUsed",
      "role",
      "projectType",
      "oracleAssigned",
      "verificationStatus",
      "verificationUpdateTime",
    ],
    additionalProperties: false,
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            email: { type: "string" },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const createDehixTalentSchema: FastifySchema = {
  description: "API to create Dehix talent for freelancer",
  tags: ["Freelancer"],
  body: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: Object.values(TalentTypeEnum),
      },
      talentId: { type: "string" },
      talentName: { type: "string" },
      experience: { type: "string" },
      monthlyPay: { type: "string" },
      level: { type: "string" },
      status: {
        type: "string",
        enum: Object.values(FreelancerStatusEnum),
        default: FreelancerStatusEnum.PENDING,
      },
      activeStatus: {
        type: "boolean",
      },
    },
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            _id: { type: "string", format: "uuid" },
            freelancerId: { type: "string" },
            type: { type: "string" },
            talentId: { type: "string" },
            talentName: { type: "string" },
            level: { type: "string" },
            experience: { type: "string" },
            status: {
              type: "string",
              enum: Object.values(DehixTalentEnum),
            },
            interviewCount: { type: "string" },
            monthlyPay: { type: "string" },
            activeStatus: {
              type: "boolean",
            },
          },
          required: ["_id", "type", "talentId", "talentName", "activeStatus"],
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const createFreelancerKycSchema: FastifySchema = {
  description: "API to create freelancer KYC details",
  tags: ["Freelancer"],
  body: {
    type: "object",
    properties: {
      kyc: {
        type: "object",
        properties: {
          aadharOrGovId: { type: "string" },
          frontImageUrl: { type: "string" },
          backImageUrl: { type: "string" },
          liveCapture: { type: "string" },
          status: {
            type: "string",
            enum: Object.values(KycStatusEnum),
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
        required: [
          "aadharOrGovId",
          "frontImageUrl",
          "backImageUrl",
          "liveCapture",
          "status",
          "createdAt",
          "updatedAt",
        ],
      },
    },
    required: ["kyc"],
  },
  response: {
    201: {
      type: "object",
      properties: {
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            _id: { type: "string" },
            aadharOrGovtId: { type: "string" },
            frontImageUrl: { type: "string" },
            backImageUrl: { type: "string" },
            liveCapture: { type: "string" },
            status: {
              type: "string",
              enum: Object.values(KycStatusEnum),
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const createDehixInterviewerSchema: FastifySchema = {
  description: "API to create Dehix interviewer for freelancer",
  tags: ["Freelancer"],
  params: {
    type: "object",
    properties: {
      freelancer_id: { type: "string" },
    },
    required: ["freelancer_id"],
  },
  body: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: Object.values(TalentTypeEnum),
      },
      talentId: { type: "string" },
      talentName: { type: "string" },
      experience: { type: "string" },
      interviewFees: { type: "string" },
      level: { type: "string" },
      status: {
        type: "string",
        enum: Object.values(DehixTalentEnum),
        default: DehixTalentEnum.PENDING,
      },
      activeStatus: {
        type: "boolean",
      },
    },
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            _id: { type: "string", format: "uuid" },
            freelancerId: { type: "string" },
            type: { type: "string" },
            talentId: { type: "string" },
            talentName: { type: "string" },
            level: { type: "string" },
            experience: { type: "string" },
            status: {
              type: "string",
              enum: Object.values(DehixTalentEnum),
            },
            interviews: {
              type: "array",
              items: { type: "string" },
            },
            interviewFees: { type: "string" },
            activeStatus: {
              type: "boolean",
            },
          },
          required: ["_id", "type", "talentId", "talentName", "activeStatus"],
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const createFreelancerChatSchema: FastifySchema = {
  description: "API to create freelancer chat details",
  tags: ["Freelancer"],
  body: {
    type: "object",
    properties: {
      participants: {
        type: "array",
        items: { type: "string" },
      },
      project_name: { type: "string" },
    },
    required: ["participants", "project_name"],
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            conversationId: { type: "string" },
            message: { type: "string" },
          },
          required: ["conversationId", "message"],
        },
      },
    },
    400: {
      description: "Bad Request",
      type: "object",
      properties: {
        message: { type: "string" },
        code: { type: "string" },
      },
    },
    404: {
      description: "Not Found",
      type: "object",
      properties: {
        message: { type: "string" },
        code: { type: "string" },
      },
    },
    500: {
      description: "Server Error",
      type: "object",
      properties: {
        message: { type: "string" },
        code: { type: "string" },
      },
    },
  },
};
