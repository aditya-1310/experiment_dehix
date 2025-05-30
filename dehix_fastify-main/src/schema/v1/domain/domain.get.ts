import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const getDomainByIdSchema: FastifySchema = {
  description: "API to get domain data",
  summary: "API to get domain data",
  tags: ["Domain"],
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
