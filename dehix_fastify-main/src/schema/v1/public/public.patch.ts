import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const patchRequestConnects: FastifySchema = {
  description: "API endpoint to retrieve a list of users by their IDs.",
  tags: ["Public"],
  summary: "Fetch user with their basic details.",
  querystring: {
    type: "object",
    properties: {
      userId: {
        type: "string",
        description: "userId",
      },
      isFreelancer: {
        type: "boolean",
        description: "Filter by freelancer users.",
      },
      isBusiness: {
        type: "boolean",
        description: "Filter by business users.",
      },
    },
  },
  response: {
    ...commonErrorResponses,
  },
};
