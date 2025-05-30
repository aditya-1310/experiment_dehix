import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const updateSkillSchema: FastifySchema = {
  description: "API for update skill",
  tags: ["Skills"],
  body: {
    type: "object",
    properties: {
      label: { type: "string" },
      description: { type: "string" },
      status: { type: "string" },
    },
    required: [],
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            label: { type: "string" },
            description: { type: "string" },
            status: { type: "string" },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};
