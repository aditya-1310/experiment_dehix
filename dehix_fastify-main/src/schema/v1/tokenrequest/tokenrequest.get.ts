import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const getTokenRequestByIdSchema: FastifySchema = {
  description: "API for fetching Token Request by ID",
  tags: ["TokenRequest"],
  params: {
    type: "object",
    properties: {
      tokenrequest_id: { type: "string" },
    },
    required: ["tokenrequest_id"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            userType: { type: "string" },
            amount: { type: "string" },
            status: { type: "string" },
            transactionId: { type: "string" },
            dateTime: { type: "string" },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const getTokenRequestByUserIdSchema: FastifySchema = {
  description: "API for fetching Token Requests by User ID",
  tags: ["TokenRequest"],
  params: {
    type: "object",
    properties: {
      user_id: { type: "string" },
    },
    required: ["user_id"],
  },
  querystring: {
    type: "object",
    properties: {
      latestConnects: { type: "boolean" },
    },
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
              userId: { type: "string" },
              userType: { type: "string" },
              amount: { type: "string" },
              status: { type: "string" },
              transactionId: { type: "string" },
              dateTime: { type: "string" },
            },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const getAllTokenRequestSchema: FastifySchema = {
  description: "API for fetching all Token Request",
  tags: ["TokenRequest"],
  querystring: {
    type: "object",
    properties: {
      page: { type: "string" },
      limit: { type: "string" },
    },
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
              userId: { type: "string" },
              userType: { type: "string" },
              amount: { type: "string" },
              status: { type: "string" },
              transactionId: { type: "string" },
              dateTime: { type: "string" },
            },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};
