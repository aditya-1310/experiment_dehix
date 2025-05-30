import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";
import {
  FreelancerInterviewPermissionEnum,
  FreelancerInterviewStatusEnum,
  FreelancerOracleNdConsultantStatusEnum,
  FreelancerStatusEnum,
  FreelancerVerificationStatusEnum,
  KycStatusEnum,
} from "../../../models/freelancer.entity";

export const updateFreelancerSchema: FastifySchema = {
  description: "API to update freelancer",
  tags: ["Freelancer"],
  body: {
    type: "object",
    properties: {
      firstName: { type: "string" },
      lastName: { type: "string" },
      userName: { type: "string" },
      password: { type: "string" },
      email: { type: "string" },
      phone: { type: "string" },
      phoneVerify: { type: "boolean" },
      dob: { type: "string", format: "date-time" },
      profilePic: { type: "string" },
      professionalInfo: {
        type: "array",
        items: {
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
            },
            verificationUpdateTime: { type: "string", format: "date-time" },
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
            "oracleAssigned",
            "verificationStatus",
            "verificationUpdateTime",
            "comments",
          ],
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
            "interviewPermission",
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
            "interviewPermission",
          ],
        },
      },
      projectDomain: {
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
            },
            interviewInfo: { type: "string" },
            interviewerRating: { type: "number" },
          },
          required: ["name"],
        },
      },
      education: {
        type: "array",
        items: {
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
            "comments",
          ],
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
            "comments",
          ],
        },
      },
      dehixTalent: {
        type: "array",
        items: {
          type: "object",
          properties: {
            skillId: { type: "string" },
            skillName: { type: "string" },
            domainId: { type: "string" },
            domainName: { type: "string" },
            status: {
              type: "string",
              enum: ["added", "verified", "rejected"],
              default: "added",
            },
            activeStatus: {
              type: "string",
              enum: ["Active", "Inactive"],
              default: "Active",
            },
          },
          required: [],
        },
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
      },
      consultant: {
        type: "object",
        properties: {
          status: {
            type: "string",
            enum: Object.values(FreelancerOracleNdConsultantStatusEnum),
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
      onboardingStatus: {
        type: "boolean",
        default: false,
      },
    },
    required: [],
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        message: {
          type: "string",
        },
      },
    },
    ...commonErrorResponses,
  },
};

const skillProperties = {
  name: { type: "string", description: "The name of the skill" },
  level: {
    type: "string",
    description: "The level of proficiency in the skill",
  },
  experience: {
    type: "string",
    description: "The years of experience with the skill",
  },
  interviewStatus: {
    type: "string",
    description: "The interview status for the skill",
    enum: Object.values(FreelancerInterviewStatusEnum),
  },
  interviewInfo: {
    type: "string",
    description: "The ObjectId of the interview information",
    nullable: true,
  },
  interviewerRating: {
    type: "number",
    description: "The rating given by the interviewer",
    nullable: true,
  },
  interviewPermission: {
    type: "string",
    description: "Freelancer is verified or not to take interviews",
    enum: Object.values(FreelancerInterviewPermissionEnum),
  },
};

export const addFreelancerSkillsSchema: FastifySchema = {
  description: "API to add skills to a freelancer",
  tags: ["Freelancer"],
  body: {
    type: "object",
    properties: {
      skills: {
        type: "array",
        description: "An array of skills to be added",
        items: {
          type: "object",
          properties: skillProperties,
          required: ["name", "level", "experience", "interviewPermission"],
        },
        minItems: 1,
      },
    },
    required: ["skills"],
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
            freelancer_id: { type: "string" },
            skills: {
              type: "array",
              items: {
                type: "object",
                properties: skillProperties,
              },
            },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const addFreelancerDomainSchema: FastifySchema = {
  description: "API to add domain to a freelancer",
  tags: ["Freelancer"],
  body: {
    type: "object",
    properties: {
      domain: {
        type: "array",
        description: "An array of domain to be added",
        items: {
          type: "object",
          properties: {
            name: { type: "string", description: "The name of the domain" },
            level: {
              type: "string",
              description: "The level of proficiency in the domain",
            },
            experience: {
              type: "string",
              description: "The years of experience with the domain",
            },
            interviewStatus: {
              type: "string",
              description: "The interview status for the domain",
              enum: Object.values(FreelancerInterviewStatusEnum),
            },
            interviewInfo: {
              type: "string",
              description: "The ObjectId of the interview information",
              nullable: true,
            },
            interviewerRating: {
              type: "number",
              description: "The rating given by the interviewer",
              nullable: true,
            },
            interviewPermission: {
              type: "string",
              enum: Object.values(FreelancerInterviewPermissionEnum),
              default: FreelancerInterviewPermissionEnum.NOT_VERIFIED,
            },
          },
        },
        minItems: 1,
      },
    },
    required: ["domain"],
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
            freelancer_id: { type: "string" },
            domain: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "The name of the domain",
                  },
                  level: {
                    type: "string",
                    description: "The level of proficiency in the domain",
                  },
                  experience: {
                    type: "string",
                    description: "The years of experience with the domain",
                  },
                  interviewStatus: {
                    type: "string",
                    description: "The interview status for the domain",
                    enum: Object.values(FreelancerInterviewStatusEnum),
                  },
                  interviewInfo: {
                    type: "string",
                    description: "The ObjectId of the interview information",
                    nullable: true,
                  },
                  interviewerRating: {
                    type: "number",
                    description: "The rating given by the interviewer",
                    nullable: true,
                  },
                  interviewPermission: {
                    type: "string",
                    enum: Object.values(FreelancerInterviewPermissionEnum),
                  },
                },
              },
            },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const oracleStatusSchema: FastifySchema = {
  description: "API to update oracle status of freelancer",
  tags: ["Freelancer"],
  body: {
    type: "object",
    properties: {
      oracleStatus: {
        type: "string",
        enum: Object.values(FreelancerOracleNdConsultantStatusEnum),
      },
    },
    required: ["oracleStatus"],
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            freelancer_id: { type: "string" },
            oracleStatus: { type: "string" },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const interviewsAlignedSchema: FastifySchema = {
  description: "API to aligned interview for freelancer",
  tags: ["Freelancer"],
  body: {
    type: "object",
    properties: {
      interviewsAligned: {
        type: "array",
        items: {
          type: "string", // Assuming ObjectId will be passed as a string
          pattern: "^[0-9a-fA-F]{24}$", // ObjectId validation pattern
        },
      },
    },
    required: ["interviewsAligned"],
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            freelancer_id: { type: "string" },
            interviewsAligned: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const experinceInProfessionalInfo: FastifySchema = {
  description: "API to manage professional experience of a freelancer",
  tags: ["Freelancer"],
  body: {
    type: "object",
    properties: {
      company: { type: "string", nullable: true },
      jobTitle: { type: "string", nullable: true },
      workDescription: { type: "string", nullable: true },
      workFrom: { type: "string", format: "date-time", nullable: true },
      workTo: { type: "string", format: "date-time", nullable: true },
      referencePersonName: { type: "string", nullable: true },
      referencePersonContact: { type: "string", nullable: true },
      githubRepoLink: { type: "string", nullable: true },
      oracleAssigned: { type: "string", nullable: true },
      verificationStatus: {
        type: "string",
        enum: Object.values(FreelancerVerificationStatusEnum),
        nullable: true,
      },
      verificationUpdateTime: {
        type: "string",
        format: "date-time",
        nullable: true,
      },
      comments: { type: "string", nullable: true },
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
            email: { type: "string" },
            professionalInfo: {
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
    },
    ...commonErrorResponses,
  },
};

export const updateEducationSchema: FastifySchema = {
  description: "API to update education data of a freelancer",
  tags: ["Freelancer"],
  body: {
    type: "object",
    properties: {
      degree: { type: "string", nullable: true },
      universityName: { type: "string", nullable: true },
      fieldOfStudy: { type: "string", nullable: true },
      startDate: { type: "string", format: "date-time", nullable: true },
      endDate: { type: "string", format: "date-time", nullable: true },
      grade: { type: "string", nullable: true },
      oracleAssigned: { type: "string", nullable: true },
      verificationStatus: {
        type: "string",
        enum: Object.values(FreelancerVerificationStatusEnum),
        nullable: true,
      },
      verificationUpdateTime: {
        type: "string",
        format: "date-time",
        nullable: true,
      },
      comments: { type: "string", nullable: true },
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
            email: { type: "string" },
            education: {
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
    },
    ...commonErrorResponses,
  },
};

export const updateProjectSchema: FastifySchema = {
  description: "API to update project data of a freelancer",
  tags: ["Freelancer"],
  body: {
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
      },
      verificationUpdateTime: { type: "string", format: "date-time" },
      comments: { type: "string" },
    },
    required: ["projectName", "description"],
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
            projects: {
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
                },
                verificationUpdateTime: { type: "string", format: "date-time" },
                comments: { type: "string" },
              },
            },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const updateNotInterestedProjectSchema: FastifySchema = {
  description: "API to update the not interested project list for a freelancer",
  tags: ["Freelancer"],
  params: {
    type: "object",
    properties: {
      project_id: { type: "string" },
    },
    required: ["project_id"],
  },
  response: {
    200: {
      description: "Successfully updated not interested project",
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Not interested project updated successfully",
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const updateDehixTalentSchema: FastifySchema = {
  description: "API to update dehix talent data for a freelancer",
  tags: ["Freelancer"],
  params: {
    type: "object",
    properties: {
      dehixtalent_id: { type: "string" },
    },
    required: ["dehixtalent_id"],
  },
  body: {
    type: "object",
    properties: {
      status: {
        type: "string",
        enum: ["pending", "verified", "rejected"],
        default: "pending",
      },
      activeStatus: {
        type: "boolean",
      },
    },
  },
  response: {
    200: {
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
              enum: ["pending", "verified", "rejected"],
            },
            interviewCount: { type: "string" },
            monthlyPay: { type: "string" },
            activeStatus: {
              type: "boolean",
            },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const updateOnboardingStatusSchema: FastifySchema = {
  description: "API to update onboarding status of freelancer",
  tags: ["Freelancer"],
  body: {
    type: "object",
    properties: {
      onboardingStatus: {
        type: "boolean",
      },
    },
    required: ["onboardingStatus"],
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            freelancer_id: { type: "string" },
            onboardingStatus: { type: "string" },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const updateFreelancerStatusSchema: FastifySchema = {
  description: "API to update the status of a freelancer",
  tags: ["Freelancer"],
  body: {
    type: "object",
    required: ["status"],
    properties: {
      status: {
        type: "string",
        enum: Object.values(FreelancerStatusEnum), // Use the enum for status
        default: FreelancerStatusEnum.PENDING,
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
            status: { type: "string" },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const updateFreelancerKycSchema: FastifySchema = {
  description: "API to update freelancer KYC details",
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
        },
      },
    },
  },
  response: {
    200: {
      description: "KYC details updated successfully",
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
    ...commonErrorResponses,
  },
};
