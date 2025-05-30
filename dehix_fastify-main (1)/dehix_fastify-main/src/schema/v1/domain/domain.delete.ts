import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const deleteDomainSchema: FastifySchema = {
  description: "API to delete domain data",
  summary: "API to delete domain data",
  tags: ["Domain"],
  params: {
    type: "object",
    properties: {
      domain_id: {
        type: "string",
        description: "The ID of the domain",
      },
    },
    required: ["domain_id"],
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
