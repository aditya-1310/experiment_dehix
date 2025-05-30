import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const getBidForProjectIdSchema: FastifySchema = {
  description: "API to get Bid data using project id",
  summary: "API to get Bid data using project id",
  tags: ["Bid"],
  params: {
    type: "object",
    properties: {
      project_id: { type: "string" },
    },
    required: ["project_id"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              userName: {
                type: "string",
              },
              bid_status: { type: "string" },
              project_id: { type: "string" },
              bidder_id: { type: "string" },
              current_price: { type: "number" },
              domain_id: { type: "string" },
              description: { type: "string" },
            },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const getBidForBidderIdSchema: FastifySchema = {
  description: "API to get Bid data using bidder id",
  summary: "API to get Bid data using bidder id",
  tags: ["Bid"],
  params: {
    type: "object",
    properties: {
      bidder_id: { type: "string" },
    },
    required: ["bidder_id"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              bid_status: { type: "string" },
              project_id: { type: "string" },
              bidder_id: { type: "string" },
              current_price: { type: "number" },
              domain_id: { type: "string" },
              profile_id: { type: "string" },
              description: { type: "string" },
            },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const getAllBidsSchema: FastifySchema = {
  description: "API to get all bids",
  summary: "API to get all bids",
  tags: ["Bid"],
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              bid_status: { type: "string" },
              project_id: { type: "string" },
              bidder_id: { type: "string" },
              current_price: { type: "number" },
              domain_id: { type: "string" },
              description: { type: "string" },
            },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const getBidForProfileIdSchema: FastifySchema = {
  description: "API to get Bid data using profile id",
  summary: "API to get Bid data using profile id",
  tags: ["Bid"],
  params: {
    type: "object",
    properties: {
      profile_id: { type: "string" },
      project_id: { type: "string" },
    },
    required: ["profile_id"],
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              bid_status: { type: "string" },
              project_id: { type: "string" },
              bidder_id: { type: "string" },
              current_price: { type: "number" },
              domain_id: { type: "string" },
              description: { type: "string" },
              userName: { type: "string" },
              createdAt: { type: "string" },
            },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};
