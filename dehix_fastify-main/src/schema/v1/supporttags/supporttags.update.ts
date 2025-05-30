import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const updateSupportTagByIdSchema: FastifySchema = {
  description: "API for updating support tag by ID",
  tags: ["Support Tags"],
  params: {
    type: "object",
    properties: {
      tag_id: { type: "string" },
    },
    required: ["tag_id"],
  },
  body: {
    type: "object",
    properties: {
      name: {
        type: "string",
      },
      count: {
        type: "number",
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
            _id: { type: "string" },
            name: {
              type: "string",
            },
            count: {
              type: "number",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};
