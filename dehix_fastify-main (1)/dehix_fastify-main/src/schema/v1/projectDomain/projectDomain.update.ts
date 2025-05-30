import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const updateProjectDomainSchema: FastifySchema = {
  description: "API for update project domain",
  tags: ["Project Domain"],
  body: {
    type: "object",
    properties: {
      label: { type: "string" },
      description: { type: "string" },
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
            _id: { type: "string" },
            label: { type: "string" },
            description: { type: "string" },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};
