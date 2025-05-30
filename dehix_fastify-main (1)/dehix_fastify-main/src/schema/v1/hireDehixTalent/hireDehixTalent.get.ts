import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";
import {
  FreelancerInterviewPermissionEnum,
  KycStatusEnum,
} from "../../../models/freelancer.entity";
import { FreelancerInvitedStatusEnum } from "../../../models/hireDehixTalent.entity";

export const getHireDehixTalentSchema: FastifySchema = {
  description: "API to get hire dehix talent data",
  tags: ["Hire"],
  response: {
    // TODO: Add 200 response schema
    ...commonErrorResponses,
  },
};

export const getInvitedDehixTalentSchema: FastifySchema = {
  description: "API to fetch invited dehix talent",
  tags: ["Hire"],
  params: {
    type: "object",
    properties: {
      hireDehixTalent_id: { type: "string" },
    },
    required: ["hireDehixTalent_id"],
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              invitedStatus: {
                type: "string",
                enum: Object.values(FreelancerInvitedStatusEnum),
              },
              firstName: { type: "string" },
              lastName: { type: "string" },
              userName: { type: "string" },
              profilePic: {
                type: "string",
              },
              description: { type: "string" },
              professionalInfo: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    company: { type: "string" },
                    jobTitle: { type: "string" },
                    workDescription: { type: "string" },
                    workFrom: { type: "string", format: "date-time" },
                    workTo: { type: "string", format: "date-time" },
                    githubRepoLink: { type: "string" },
                  },
                },
              },
              skills: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    name: { type: "string" },
                    level: { type: "string" },
                    experience: { type: "string" },
                    interviewPermission: {
                      type: "string",
                      enum: Object.values(FreelancerInterviewPermissionEnum),
                    },
                  },
                },
              },
              domain: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    name: { type: "string" },
                    level: { type: "string" },
                    experience: { type: "string" },
                    interviewPermission: {
                      type: "string",
                      enum: Object.values(FreelancerInterviewPermissionEnum),
                    },
                  },
                },
              },
              projectDomain: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    name: { type: "string" },
                    level: { type: "string" },
                    experience: { type: "string" },
                  },
                },
              },
              education: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    degree: { type: "string" },
                    fieldOfStudy: { type: "string" },
                    startDate: { type: "string", format: "date-time" },
                    endDate: { type: "string", format: "date-time" },
                    grade: { type: "string" },
                  },
                },
              },
              role: { type: "string" },
              projects: {
                type: "object",
                additionalProperties: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    projectName: { type: "string" },
                    description: { type: "string" },
                    verified: { type: "boolean" },
                    githubLink: { type: "string" },
                    start: { type: "string", format: "date-time" },
                    end: { type: "string", format: "date-time" },
                    techUsed: {
                      type: "array",
                      items: { type: "string" },
                    },
                    role: { type: "string" },
                    projectType: { type: "string" },
                  },
                },
              },
              referral: {
                type: "object",
                properties: {
                  referralCode: { type: "string" },
                },
              },
              onboardingStatus: {
                type: "boolean",
              },
              kyc: {
                type: "object",
                properties: {
                  _id: { type: "string" },
                  aadharOrGovId: { type: "string" },
                  frontImageUrl: { type: "string" },
                  backImageUrl: { type: "string" },
                  liveCapture: { type: "string" },
                  status: {
                    type: "string",
                    enum: Object.values(KycStatusEnum),
                  },
                  createdAt: { type: "string", format: "date-time" },
                  updateAt: { type: "string", format: "date-time" },
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

export const getDehixTalentInLobbySchema: FastifySchema = {
  description: "API to fetch dehix talent in lobby",
  tags: ["Hire"],
  params: {
    type: "object",
    properties: {
      hireDehixTalent_id: { type: "string" },
    },
    required: ["hireDehixTalent_id"],
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              DehixTalentIdInLobby: { type: "string" },
              firstName: { type: "string" },
              lastName: { type: "string" },
              userName: { type: "string" },
              profilePic: {
                type: "string",
              },
              description: { type: "string" },
              professionalInfo: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    company: { type: "string" },
                    jobTitle: { type: "string" },
                    workDescription: { type: "string" },
                    workFrom: { type: "string", format: "date-time" },
                    workTo: { type: "string", format: "date-time" },
                    githubRepoLink: { type: "string" },
                  },
                },
              },
              skills: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    name: { type: "string" },
                    level: { type: "string" },
                    experience: { type: "string" },
                    interviewPermission: {
                      type: "string",
                      enum: Object.values(FreelancerInterviewPermissionEnum),
                    },
                  },
                },
              },
              domain: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    name: { type: "string" },
                    level: { type: "string" },
                    experience: { type: "string" },
                    interviewPermission: {
                      type: "string",
                      enum: Object.values(FreelancerInterviewPermissionEnum),
                    },
                  },
                },
              },
              projectDomain: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    name: { type: "string" },
                    level: { type: "string" },
                    experience: { type: "string" },
                  },
                },
              },
              education: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    degree: { type: "string" },
                    fieldOfStudy: { type: "string" },
                    startDate: { type: "string", format: "date-time" },
                    endDate: { type: "string", format: "date-time" },
                    grade: { type: "string" },
                  },
                },
              },
              role: { type: "string" },
              projects: {
                type: "object",
                additionalProperties: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    projectName: { type: "string" },
                    description: { type: "string" },
                    verified: { type: "boolean" },
                    githubLink: { type: "string" },
                    start: { type: "string", format: "date-time" },
                    end: { type: "string", format: "date-time" },
                    techUsed: {
                      type: "array",
                      items: { type: "string" },
                    },
                    role: { type: "string" },
                    projectType: { type: "string" },
                  },
                },
              },
              referral: {
                type: "object",
                properties: {
                  referralCode: { type: "string" },
                },
              },
              onboardingStatus: {
                type: "boolean",
              },
              kyc: {
                type: "object",
                properties: {
                  _id: { type: "string" },
                  aadharOrGovId: { type: "string" },
                  frontImageUrl: { type: "string" },
                  backImageUrl: { type: "string" },
                  liveCapture: { type: "string" },
                  status: {
                    type: "string",
                    enum: Object.values(KycStatusEnum),
                  },
                  createdAt: { type: "string", format: "date-time" },
                  updateAt: { type: "string", format: "date-time" },
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

export const getSelectedDehixTalentSchema: FastifySchema = {
  description: "API to fetch Selected dehix talent",
  tags: ["Hire"],
  params: {
    type: "object",
    properties: {
      hireDehixTalent_id: { type: "string" },
    },
    required: ["hireDehixTalent_id"],
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              selectedDehixTalentId: { type: "string" },
              firstName: { type: "string" },
              lastName: { type: "string" },
              userName: { type: "string" },
              profilePic: {
                type: "string",
              },
              description: { type: "string" },
              professionalInfo: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    company: { type: "string" },
                    jobTitle: { type: "string" },
                    workDescription: { type: "string" },
                    workFrom: { type: "string", format: "date-time" },
                    workTo: { type: "string", format: "date-time" },
                    githubRepoLink: { type: "string" },
                  },
                },
              },
              skills: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    name: { type: "string" },
                    level: { type: "string" },
                    experience: { type: "string" },
                    interviewPermission: {
                      type: "string",
                      enum: Object.values(FreelancerInterviewPermissionEnum),
                    },
                  },
                },
              },
              domain: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    name: { type: "string" },
                    level: { type: "string" },
                    experience: { type: "string" },
                    interviewPermission: {
                      type: "string",
                      enum: Object.values(FreelancerInterviewPermissionEnum),
                    },
                  },
                },
              },
              projectDomain: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    name: { type: "string" },
                    level: { type: "string" },
                    experience: { type: "string" },
                  },
                },
              },
              education: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    degree: { type: "string" },
                    fieldOfStudy: { type: "string" },
                    startDate: { type: "string", format: "date-time" },
                    endDate: { type: "string", format: "date-time" },
                    grade: { type: "string" },
                  },
                },
              },
              role: { type: "string" },
              projects: {
                type: "object",
                additionalProperties: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    projectName: { type: "string" },
                    description: { type: "string" },
                    verified: { type: "boolean" },
                    githubLink: { type: "string" },
                    start: { type: "string", format: "date-time" },
                    end: { type: "string", format: "date-time" },
                    techUsed: {
                      type: "array",
                      items: { type: "string" },
                    },
                    role: { type: "string" },
                    projectType: { type: "string" },
                  },
                },
              },
              referral: {
                type: "object",
                properties: {
                  referralCode: { type: "string" },
                },
              },
              onboardingStatus: {
                type: "boolean",
              },
              kyc: {
                type: "object",
                properties: {
                  _id: { type: "string" },
                  aadharOrGovId: { type: "string" },
                  frontImageUrl: { type: "string" },
                  backImageUrl: { type: "string" },
                  liveCapture: { type: "string" },
                  status: {
                    type: "string",
                    enum: Object.values(KycStatusEnum),
                  },
                  createdAt: { type: "string", format: "date-time" },
                  updateAt: { type: "string", format: "date-time" },
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

export const getRejectedDehixTalentSchema: FastifySchema = {
  description: "API to fetch Rejected dehix talent",
  tags: ["Hire"],
  params: {
    type: "object",
    properties: {
      hireDehixTalent_id: { type: "string" },
    },
    required: ["hireDehixTalent_id"],
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              rejectedDehixTalentId: { type: "string" },
              firstName: { type: "string" },
              lastName: { type: "string" },
              userName: { type: "string" },
              profilePic: {
                type: "string",
              },
              description: { type: "string" },
              professionalInfo: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    company: { type: "string" },
                    jobTitle: { type: "string" },
                    workDescription: { type: "string" },
                    workFrom: { type: "string", format: "date-time" },
                    workTo: { type: "string", format: "date-time" },
                    githubRepoLink: { type: "string" },
                  },
                },
              },
              skills: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    name: { type: "string" },
                    level: { type: "string" },
                    experience: { type: "string" },
                    interviewPermission: {
                      type: "string",
                      enum: Object.values(FreelancerInterviewPermissionEnum),
                    },
                  },
                },
              },
              domain: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    name: { type: "string" },
                    level: { type: "string" },
                    experience: { type: "string" },
                    interviewPermission: {
                      type: "string",
                      enum: Object.values(FreelancerInterviewPermissionEnum),
                    },
                  },
                },
              },
              projectDomain: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    name: { type: "string" },
                    level: { type: "string" },
                    experience: { type: "string" },
                  },
                },
              },
              education: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    degree: { type: "string" },
                    fieldOfStudy: { type: "string" },
                    startDate: { type: "string", format: "date-time" },
                    endDate: { type: "string", format: "date-time" },
                    grade: { type: "string" },
                  },
                },
              },
              role: { type: "string" },
              projects: {
                type: "object",
                additionalProperties: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    projectName: { type: "string" },
                    description: { type: "string" },
                    verified: { type: "boolean" },
                    githubLink: { type: "string" },
                    start: { type: "string", format: "date-time" },
                    end: { type: "string", format: "date-time" },
                    techUsed: {
                      type: "array",
                      items: { type: "string" },
                    },
                    role: { type: "string" },
                    projectType: { type: "string" },
                  },
                },
              },
              referral: {
                type: "object",
                properties: {
                  referralCode: { type: "string" },
                },
              },
              onboardingStatus: {
                type: "boolean",
              },
              kyc: {
                type: "object",
                properties: {
                  _id: { type: "string" },
                  aadharOrGovId: { type: "string" },
                  frontImageUrl: { type: "string" },
                  backImageUrl: { type: "string" },
                  liveCapture: { type: "string" },
                  status: {
                    type: "string",
                    enum: Object.values(KycStatusEnum),
                  },
                  createdAt: { type: "string", format: "date-time" },
                  updateAt: { type: "string", format: "date-time" },
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
