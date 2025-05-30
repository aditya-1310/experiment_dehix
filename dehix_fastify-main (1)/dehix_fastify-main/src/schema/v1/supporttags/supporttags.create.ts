import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const createSupportTagsSchema: FastifySchema = {
  description: "API for creating support tags",
  summary: "API to Create support tags",
  tags: ["Support Tags"],
  body: {
    type: "object",
    required: ["name"],
    properties: {
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
