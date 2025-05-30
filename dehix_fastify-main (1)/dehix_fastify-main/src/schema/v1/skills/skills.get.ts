import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const getSkillByIdSchema: FastifySchema = {
  description: "API to get skill data",
  tags: ["Skills"],
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            _id: { type: "string" },
            label: { type: "string" },
            description: { type: "string" },
            createdBy: { type: "string" },
            createdById: { type: "string" },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            status: { type: "string" },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};
