import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const deleteInterviewSchema: FastifySchema = {
  description: "API to delete interview",
  tags: ["Interview"],
  params: {
    type: "object",
    properties: {
      interview_id: {
        type: "string",
        description: "The ID of the interview",
      },
    },
    required: ["interview_id"],
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

export const deleteInterviewBidSchema: FastifySchema = {
  description: "API to delete interview bid",
  tags: ["Interview"],
  params: {
    type: "object",
    properties: {
      interview_id: {
        type: "string",
        description: "The ID of the interview",
      },
      bid_id: {
        type: "string",
        description: "The ID of the interview bid to be deleted",
      },
    },
    required: ["interview_id", "bid_id"],
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
