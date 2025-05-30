import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const getAllAdminNotesSchema: FastifySchema = {
  description: "API endpoint to retrieve a list of all admin notes.",
  tags: ["Admin Notes"],
  summary: "Fetch all admin notes.",
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
