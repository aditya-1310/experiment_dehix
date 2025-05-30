import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const updateDomainSchema: FastifySchema = {
  description: "API for update domain",
  summary: "API for update domain",
  tags: ["Domain"],
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
            _id: { type: "string" },
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
