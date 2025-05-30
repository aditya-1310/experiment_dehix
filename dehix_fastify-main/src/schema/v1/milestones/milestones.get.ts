import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const getMilestoneSchema: FastifySchema = {
  description: "API to fetch a milestone",
  summary: "Get a Milestone",
  tags: ["Milestones"],
  querystring: {
    type: "object",
    properties: {
      projectId: {
        type: "string",
        description: "ID of the user to fetch the milestone for",
      },
    },
  },
  response: {
    ...commonErrorResponses,
  },
};
