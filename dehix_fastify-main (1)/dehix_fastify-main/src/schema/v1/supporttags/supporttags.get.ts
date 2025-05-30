import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const getAllSupportTagsSchema: FastifySchema = {
  description: "API for fetching all support tags",
  tags: ["Support Tags"],
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
    },
    ...commonErrorResponses,
  },
};

export const getSupportTagByIdSchema: FastifySchema = {
  description: "API for fetching support tag by ID",
  tags: ["Support Tags"],
  params: {
    type: "object",
    properties: {
      tag_id: { type: "string" },
    },
    required: ["tag_id"],
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
