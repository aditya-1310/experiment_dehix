import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const deleteSupportTagByIdSchema: FastifySchema = {
  description: "API for deleting support tags",
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
      description: "Success",
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
    ...commonErrorResponses,
  },
};
