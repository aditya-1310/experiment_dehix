import { FastifySchema } from "fastify";

export const createTransactionSchema: FastifySchema = {
  description: "API for creating Transaction",
  tags: ["Transaction"],
  body: {
    type: "object",
    properties: {
      from: {
        type: "string",
      },
      to: {
        type: "string",
      },
      amount: {
        type: "number",
      },
      type: {
        type: "string",
        enum: ["payment", "referral", "rewards", "system generated"],
      },
      reference: {
        type: "string",
      },
      from_type: {
        type: "string",
        enum: ["system", "freelancer", "business", "admin", "verification"],
      },
      reference_id: {
        type: "string",
      },
    },
    required: ["from", "to", "amount", "type", "from_type"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            _id: { type: "string" },
            from: { type: "string" },
            to: { type: "string" },
            amount: { type: "number" },
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
