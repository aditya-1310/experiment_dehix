import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";
import {
  BusinessStatusEnum,
  KycBusinessStatusEnum,
} from "../../../models/business.entity";

export const getBusinessSchema: FastifySchema = {
  description: "API to get business data by business id",
  summary: "API to get business data by business id",
  tags: ["Business"],
  params: {
    type: "object",
    properties: {
      business_id: { type: "string" },
    },
    required: ["business_id"],
  },
  response: {
    // TODO: Add 200 response schema
    ...commonErrorResponses,
  },
};

export const getAllBusinessSchema: FastifySchema = {
  description: "API to get all business data",
  summary: "API to get all business data",
  tags: ["Business"],
  querystring: {
    type: "object",
    properties: {
      page: {
        type: "integer",
      },
      limit: {
        type: "integer",
      },
    },
  },
  response: {
    200: {
      // TODO: Need to change 200 response to the updated businessSchema
      type: "object",
      properties: {
        message: { type: "string" },
        data: {
          type: "array",
          properties: {
            _id: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            companyName: { type: "string" },
            companySize: { type: "string" },
            password: { type: "string" },
            email: { type: "string", format: "email" },
            phone: { type: "string" },
            phoneVerify: { type: "boolean" },
            position: { type: "string" },
            refer: { type: "string", nullable: true },
            verified: { type: "string", nullable: true },
            isVerified: { type: "boolean" },
            linkedin: { type: "string" },
            personalWebsite: { type: "string" },
            isBusiness: { type: "boolean" },
            connects: { type: "integer" },
            otp: { type: "string" },
            otpverified: { type: "string" },
            ProjectList: {
              type: "array",
              items: { type: "string" },
            },
            Appliedcandidates: {
              type: "array",
              items: { type: "string" },
            },
            hirefreelancer: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  freelancer: { type: "string" },
                  status: {
                    type: "string",
                    enum: ["Pending", "Approved", "Rejected"],
                  },
                  _id: { type: "string" },
                },
              },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            __v: { type: "integer" },
            status: {
              type: "string",
              enum: Object.values(BusinessStatusEnum),
            },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const getBusinessProjectSchema: FastifySchema = {
  description: "API to get business project data",
  summary: "API to get business project data",
  tags: ["Project"],
  querystring: {
    type: "object",
    properties: {
      status: {
        type: "string",
        enum: ["Active", "Pending", "Completed", "Rejected"],
        description: "Filter projects by status",
      },
    },
  },
  response: {
    // TODO: Add 200 response schema
    ...commonErrorResponses,
  },
};

export const getBusinessDetailsSchema: FastifySchema = {
  description: "API to get BUSINESS profile data",
  summary: "API to get BUSINESS profile data",
  tags: ["Business"],
  response: {
    200: {
      type: "object",
      properties: {
        _id: { type: "string" },
        firstName: { type: "string" },
        lastName: { type: "string" },
        companyName: { type: "string" },
        email: { type: "string", format: "email" },
        linkedin: { type: "string", format: "uri", nullable: true },
        personalWebsite: { type: "string", format: "uri", nullable: true },
        connects: { type: "number" },
        ProjectList: {
          type: "array",
          items: { type: "string" },
        },
      },
    },
    404: {
      type: "object",
      properties: {
        message: {
          type: "string",
        },
        code: {
          type: "string",
        },
      },
    },
    403: {
      type: "object",
      properties: {
        code: {
          type: "string",
        },
        message: {
          type: "string",
        },
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

export const getBusinessDetailsPublicSchema: FastifySchema = {
  description: "API to get BUSINESS profile data",
  summary: "API to get BUSINESS profile data",
  tags: ["Public"],
  response: {
    200: {
      type: "object",
      properties: {
        _id: { type: "string" },
        firstName: { type: "string" },
        lastName: { type: "string" },
        companyName: { type: "string" },
        email: { type: "string", format: "email" },
        linkedin: { type: "string", format: "uri", nullable: true },
        personalWebsite: { type: "string", format: "uri", nullable: true },
        connects: { type: "number" },
        ProjectList: {
          type: "array",
          items: { type: "string" },
        },
      },
    },
    404: {
      type: "object",
      properties: {
        message: {
          type: "string",
        },
        code: {
          type: "string",
        },
      },
    },
    403: {
      type: "object",
      properties: {
        code: {
          type: "string",
        },
        message: {
          type: "string",
        },
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

export const getBusinessKycSchema: FastifySchema = {
  description: "API to get BUSINESS KYC details",
  tags: ["Business"],
  response: {
    200: {
      type: "object",
      properties: {
        _id: { type: "string" },
        businessProof: { type: "string" },
        verification: { type: "string" },
        frontImageUrl: { type: "string" },
        backImageUrl: { type: "string" },
        liveCapture: { type: "string" },
        status: {
          type: "string",
          enum: Object.values(KycBusinessStatusEnum),
        },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
    },
    ...commonErrorResponses,
  },
};
