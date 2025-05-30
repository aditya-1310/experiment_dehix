import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const deleteProjectDomainSchema: FastifySchema = {
  description: "API to delete project-domain data",
  tags: ["Project Domain"],
  params: {
    type: "object",
    properties: {
      projectDomain_id: {
        type: "string",
        description: "The ID of the project-domain",
      },
    },
    required: ["projectDomain_id"],
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
