/**
 * File: login.ts
 * Author: Akhil
 * Date: 30-04-2024
 * Description:schema for API for bidding
 */

import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";
import { StatusEnum } from "../../../models/bid.entity";

export const updateBidSchema: FastifySchema = {
  description: "API for update the bid data",
  summary: "API for update the bid data",
  tags: ["Bid"],
  body: {
    type: "object",
    properties: {
      current_price: { type: "number" },
      domain_id: { type: "string" },
    },
    required: [],
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

export const updateBidStatusSchema: FastifySchema = {
  description: "API to update status of bid",
  summary: "API to update status of bid",
  tags: ["Bid"],
  body: {
    type: "object",
    properties: {
      bid_status: {
        type: "string",
        enum: Object.values(StatusEnum),
      },
    },
    required: [],
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: {
          type: "string",
        },
      },
    },
    ...commonErrorResponses,
  },
};
