import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const deleteProjectProfileByIdSchema: FastifySchema = {
  description: "API for deleting a project profile by ID",
  tags: ["Profiles"],
  params: {
    type: "object",
    properties: {
      project_id: { type: "string" },
      profile_id: { type: "string" },
    },
    required: ["project_id", "profile_id"],
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
