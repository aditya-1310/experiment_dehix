import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const updateVerificationStatusSchema: FastifySchema = {
  description: "API to update verification status by document id",
  tags: ["Verification"],
  querystring: {
    type: "object",
    properties: {
      doc_type: {
        type: "string",
        enum: ["skill", "domain", "education", "project", "experience"],
        description: "Filter verification request by doc_type",
      },
    },
  },
  params: {
    type: "object",
    properties: {
      document_id: {
        type: "string",
        description: "ID of the document",
      },
    },
    required: [],
  },
  body: {
    type: "object",
    properties: {
      verification_status: {
        type: "string",
        enum: ["PENDING", "APPROVED", "DENIED"],
        description: "The new verification status",
      },
      comments: {
        type: "string",
        description: "The new verification comment",
      },
    },
    required: [],
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
        updatedVerification: {
          type: "object",
          properties: {
            verifier_id: { type: "string" },
            verification_status: { type: "string" },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const updateVerificationCommentSchema: FastifySchema = {
  description: "API to update verification status",
  tags: ["Verification"],
  params: {
    type: "object",
    properties: {
      verification_id: {
        type: "string",
        description: "Verification ID",
      },
    },
  },
  body: {
    type: "object",
    properties: {
      comment: {
        type: "string",
        description: "The new verification comment",
      },
      verifiedAt: {
        type: "string",
        format: "date-time",
      },
      verification_status: {
        type: "string",
        enum: ["PENDING", "APPROVED", "DENIED"],
      },
    },
    required: [],
  },
  response: {
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
