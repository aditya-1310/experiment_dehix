import { FastifySchema } from "fastify";

export const updateTransactionSchema: FastifySchema = {
  description: "API for update Transaction",
  tags: ["Transaction"],
  body: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["payment", "referral", "reward", "system generated"],
      },
      reference: { type: "string" },
      from_type: {
        type: "string",
        enum: ["system", "freelancer", "business", "admin", "verification"],
      },
      reference_id: { type: "string" },
    },
    required: [],
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            type: { type: "string" },
            reference: { type: "string" },
            from_type: { type: "string" },
            reference_id: { type: "string" },
          },
        },
      },
    },
    401: {
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
