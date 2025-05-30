/**
 * File: get.ts
 * Author: Akhil
 * Date: 22-05-2024
 * Description:schema for API to get FREELANCER profile data
 */

import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";
import { StatusEnum } from "../../../models/project.entity";
import {
  FreelancerInterviewPermissionEnum,
  KycStatusEnum,
} from "../../../models/freelancer.entity";
import { TalentTypeEnum } from "../../../models/freelancer.entity";

export const getFreelancerSchema: FastifySchema = {
  description: "API to get FREELANCER profile data",
  tags: ["Freelancer"],
  response: {
    // TODO: Add 200 response schema
    ...commonErrorResponses,
  },
};

export const getFreelancerDetails: FastifySchema = {
  description: "API to get FREELANCER profile details",
  tags: ["Freelancer"],
  params: {
    type: "object",
    properties: {
      freelancer_username: { type: "string" },
    },
    required: ["freelancer_username"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        _id: { type: "string" },
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
    ...commonErrorResponses,
  },
};

export const getFreelancerProjectSchema: FastifySchema = {
  description: "API to get FREELANCER project data",
  tags: ["Freelancer"],
  querystring: {
    type: "object",
    properties: {
      status: {
        type: "string",
        enum: Object.values(StatusEnum),
        description: "Filter projects by status",
      },
    },
  },
  response: {
    // TODO: Add 200 response schema
    ...commonErrorResponses,
  },
};

export const getFreelancerOwnProjectSchema: FastifySchema = {
  description: "API to get freelancer own projects data",
  tags: ["Freelancer"],
  response: {
    // TODO: Add 200 response schema
    ...commonErrorResponses,
  },
};

export const getFreelancerSkillsSchema: FastifySchema = {
  description: "API to get freelancer skills data",
  tags: ["Freelancer"],
  response: {
    // TODO: Add 200 response schema
    ...commonErrorResponses,
  },
};

export const getFreelancerDomainSchema: FastifySchema = {
  description: "API to get freelancer domain data",
  tags: ["Freelancer"],
  response: {
    // TODO: Add 200 response schema
    ...commonErrorResponses,
  },
};

export const getAllDehixTalentSchema: FastifySchema = {
  description: "API to get freelancer domain data",
  tags: ["Freelancer"],
  querystring: {
    type: "object",
    properties: {
      limit: {
        type: "number",
        description: "initial fetch data",
      },
      skip: {
        type: "number",
        description: "after fetching initial data",
      },
    },
  },
  response: {
    // TODO: Add 200 response schema
    ...commonErrorResponses,
  },
};

export const getFreelancerDehixTalentSchema: FastifySchema = {
  description:
    "API to get freelancer dehix talent data categorized into skill and domain",
  tags: ["Freelancer"],
  params: {
    type: "object",
    properties: {
      freelancer_id: { type: "string" },
    },
    required: ["freelancer_id"],
  },
  querystring: {
    type: "object",
    properties: {
      status: { type: "string" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            skills: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  _id: { type: "string", format: "uuid" },
                  freelancerId: { type: "string" },
                  type: {
                    type: "string",
                    enum: Object.values(TalentTypeEnum),
                  },
                  talentId: { type: "string" },
                  talentName: { type: "string" },
                  status: {
                    type: "string",
                    enum: ["added", "verified", "rejected"],
                  },
                  activeStatus: {
                    type: "boolean",
                  },
                  interviewCount: { type: "string" },
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
                  experience: { type: "string" },
                  level: { type: "string" },
                  monthlyPay: { type: "string" },
                },
              },
            },
            domains: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  _id: { type: "string", format: "uuid" },
                  freelancerId: { type: "string" },
                  type: {
                    type: "string",
                    enum: Object.values(TalentTypeEnum),
                  },
                  talentId: { type: "string" },
                  talentName: { type: "string" },
                  status: {
                    type: "string",
                    enum: ["added", "verified", "rejected"],
                  },
                  activeStatus: {
                    type: "boolean",
                  },
                  experience: { type: "string" },
                  level: { type: "string" },
                  monthlyPay: { type: "string" },
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

export const getFreelancerEducationSchema: FastifySchema = {
  description: "API to get education data of a freelancer",
  tags: ["Freelancer"],
  response: {
    // TODO: Add 200 response schema
    ...commonErrorResponses,
  },
};

export const getFreelancerPublicDetails: FastifySchema = {
  description: "API to get FREELANCER profile details",
  tags: ["Public"],
  response: {
    200: {
      type: "object",
      properties: {
        _id: { type: "string" },
        firstName: { type: "string" },
        lastName: { type: "string" },
        userName: { type: "string" },
        profilePic: {
          type: "string",
        },
        description: { type: "string" },
        professionalInfo: {
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
        education: {
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
        onboardingStatus: {
          type: "boolean",
        },
      },
    },
    404: {
      type: "object",
      properties: {
        message: { type: "string" },
        code: { type: "string" },
      },
    },
    403: {
      type: "object",
      properties: {
        code: { type: "string" },
        message: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};

export const getSkillDomainVerifiersSchema: FastifySchema = {
  description: "API to get freelancers to verify skills or domains",
  tags: ["Freelancer"],
  querystring: {
    type: "object",
    properties: {
      doc_type: {
        type: "string",
        enum: ["SKILL", "DOMAIN"],
        description: "Filter verifier by doc_type",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              fullName: { type: "string" },
              email: { type: "string" },
            },
            required: ["_id", "fullName"],
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const getFreelancerKycSchema: FastifySchema = {
  description: "API to get FREELANCER KYC details",
  tags: ["Freelancer"],
  response: {
    200: {
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
