/* eslint-disable prettier/prettier */
import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const createAdminNotesSchema: FastifySchema = {
  description: "API for creating notes",
  tags: ["Admin Notes"],
  body: {
    type: "object",
    properties: {
      userId: {
        type: "string",
      },
      username: {
        type: "string",
      },
      title: {
        type: "string",
      },
      content: {
        type: "string",
      },
      banner: {
        type: "string",
      },
      isHTML: {
        type: "string",
      },
      entityID: {
        type: "string",
      },
      entityType: {
        type: "string",
      },
      type: {
        type: "string",
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
            title: { type: "string" },
            content: { type: "string" },
            banner: { type: "string" },
            bgColor: { type: "string" },
            isHTML: { type: "boolean" },
            entityID: { type: "string" },
            entityType: { type: "string" },
            noteType: { type: "string" },
            type: { type: "string" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};
