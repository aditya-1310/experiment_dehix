/* eslint-disable prettier/prettier */
import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const updateAdminNotesSchema: FastifySchema = {
  description: "API for update note",
  tags: ["Admin Notes"],
  body: {
    type: "object",
    properties: {
      title: {
        type: "string",
      },
      content: {
        type: "string",
      },
      banner: {
        type: "string",
      },
      type: {
        type: "string",
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
            title: {
              type: "string",
            },
            content: {
              type: "string",
            },
            banner: {
              type: "string",
            },
            type: {
              type: "string",
            },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};
