import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const getDomainSchema: FastifySchema = {
  description: "API to get all skills",
  summary: "API to get all skills",
  tags: ["Domain"],
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              label: { type: "string" },
              description: { type: "string" },
              createdBy: { type: "string" },
              createdAt: {
                type: "string",
                format: "date-time",
              },
              status: { type: "string" },
            },
            required: ["_id", "label"],
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};
