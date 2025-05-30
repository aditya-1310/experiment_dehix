import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const deleteResumeSchema: FastifySchema = {
  description: "API for deleting a resume by id",
  tags: ["Resume"],
  params: {
    type: "object",
    properties: {
      userId: { type: "string" },
    },
    required: ["resumeId"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
    ...commonErrorResponses,
  },
};
