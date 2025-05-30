import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const getNotesSchema: FastifySchema = {
  description: "API for retrieving notes in categorized arrays",
  summary: "API to Get notes",
  tags: ["Notes"],
  querystring: {
    type: "object",
    properties: {
      userId: { type: "string", description: "Enter your userId" },
    },
    required: ["userId"],
    additionalProperties: false,
  },
  response: {
    ...commonErrorResponses,
  },
};
