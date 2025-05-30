import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const deleteMilestoneSchema: FastifySchema = {
  description: "API to delete a milestone",
  summary: "Delete a Milestone",
  tags: ["Milestones"],
  params: {
    type: "object",
    properties: {
      milestoneId: {
        type: "string",
        description: "ID of the milestone to delete",
      },
    },
    required: ["milestoneId"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
    ...commonErrorResponses,
  },
};
