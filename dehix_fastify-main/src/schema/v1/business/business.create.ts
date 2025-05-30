import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";
import { KycBusinessStatusEnum } from "../../../models/business.entity";

export const createBusinessSchema: FastifySchema = {
  description: "API to create business data",
  summary: "API to create business data",
  tags: ["Register"],
  body: {
    type: "object",
    required: [
      "firstName",
      "lastName",
      "userName",
      "companyName",
      "companySize",
      "email",
      "phone",
      "position",
      "refer",
      "verified",
      "isVerified",
      "linkedin",
      "personalWebsite",
      "isBusiness",
      "connects",
    ],
    properties: {
      firstName: {
        type: "string",
      },
      lastName: {
        type: "string",
      },
      userName: {
        type: "string",
      },
      companyName: {
        type: "string",
      },
      profilePic: {
        type: "string",
      },
      password: {
        type: "string",
      },
      companySize: {
        type: "string",
      },
      email: {
        type: "string",
      },
      phone: {
        type: "string",
      },
      phoneVerify: {
        type: "boolean",
      },
      position: {
        type: "string",
      },
      refer: {
        type: "string",
      },
      verified: {
        type: "string",
      },
      isVerified: {
        type: "boolean",
        default: false,
      },
      linkedin: {
        type: "string",
      },
      personalWebsite: {
        type: "string",
      },
      isBusiness: {
        type: "boolean",
        default: true,
      },
      connects: {
        type: "integer",
        default: 0,
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
            _id: { type: "string" },
            email: { type: "string" },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const createBusinessKycSchema: FastifySchema = {
  description: "API to create Business KYC details",
  tags: ["Business"],
  body: {
    type: "object",
    properties: {
      businessProof: { type: "string" },
      verification: { type: "string" },
      frontImageUrl: { type: "string" },
      backImageUrl: { type: "string" },
      liveCapture: { type: "string" },
      status: {
        type: "string",
        enum: Object.values(KycBusinessStatusEnum),
      },
    },
    required: [
      "businessProof",
      "verification",
      "frontImageUrl",
      "backImageUrl",
      "liveCapture",
      "status",
    ],
  },
  response: {
    201: {
      type: "object",
      properties: {
        data: {
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
      },
    },
    ...commonErrorResponses,
  },
};

export const createBusinessChatSchema: FastifySchema = {
  description: "API to create business chat details",
  tags: ["Business"],
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
