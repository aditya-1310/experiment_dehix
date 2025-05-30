import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const getResumesSchema: FastifySchema = {
  description: "API for retrieving resume",
  summary: "API to Get resume",
  tags: ["Resume"],
  querystring: {
    type: "object",
    properties: {
      userId: { type: "string" },
    },
    required: ["userId"],
  },
  response: {
    ...commonErrorResponses,
  },
};
