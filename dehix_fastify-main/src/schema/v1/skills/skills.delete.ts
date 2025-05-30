import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const deleteSkillSchema: FastifySchema = {
  description: "API to delete skill data",
  tags: ["Skills"],
  params: {
    type: "object",
    properties: {
      skill_id: {
        type: "string",
        description: "The ID of the skill",
      },
    },
    required: ["skill_id"],
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
