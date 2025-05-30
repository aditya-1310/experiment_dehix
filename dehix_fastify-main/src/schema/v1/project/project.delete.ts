import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const deleteProjectSchema: FastifySchema = {
  description: "API to delete a project by ID",
  tags: ["Project"],
  params: {
    type: "object",
    properties: {
      projectId: { type: "string" },
    },
    required: ["project_id"],
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
