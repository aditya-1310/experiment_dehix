import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const bidApplySchema: FastifySchema = {
  description: "API for creating a bid",
  tags: ["Bid"],
  summary: "API for creating a bid",
  body: {
    type: "object",
    properties: {
      bidder_id: { type: "string" },
      current_price: { type: "number" },
      project_id: { type: "string" },
      domain_id: { type: "string" },
      description: {
        type: "string",
      },
      profile_id: { type: "string" },
      biddingValue: { type: "number" },
    },
    required: ["bidder_id", "current_price", "project_id", "biddingValue"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            bidder_id: { type: "string" },
            project_id: { type: "string" },
            bid_status: { type: "string" },
            current_price: { type: "string" },
            domain_id: { type: "string" },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};
