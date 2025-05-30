import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const updateFaqSchema: FastifySchema = {
  description: "API to update a Faq",
  tags: ["Faq"],
  body: {
    type: "object",
    properties: {
      question: { type: "string" },
      answer: { type: "string" },
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
            _id: { type: "string" },
            question: { type: "string" },
            answer: { type: "string" },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const updateFaqStatusSchema = {
  description: "API to update faq status",
  tags: ["Faq"],
  body: {
    type: "object",
    properties: {
      status: {
        type: "string",
        enum: ["active", "inactive"],
        description: "The status of the faq",
      },
    },
    required: ["status"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
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
