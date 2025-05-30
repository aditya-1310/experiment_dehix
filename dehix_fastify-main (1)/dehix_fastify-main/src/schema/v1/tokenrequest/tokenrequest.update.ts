import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";
import {
  TokenRequestStatus,
  UserType,
} from "../../../models/tokenrequest.entity";

export const updateTokenRequestSchema: FastifySchema = {
  description: "API for updating Token Request",
  tags: ["TokenRequest"],
  params: {
    type: "object",
    properties: {
      tokenrequest_id: { type: "string" },
    },
    required: ["tokenrequest_id"],
  },
  body: {
    type: "object",
    properties: {
      userType: {
        type: "string",
        enum: Object.values(UserType), // Using UserType enum values
      },
      amount: {
        type: "string",
      },
      transactionId: {
        type: "string",
      },
      status: {
        type: "string",
        enum: Object.values(TokenRequestStatus), // Using TokenRequestStatus enum values
      },
      dateTime: {
        type: "string",
        format: "date-time",
      },
    },
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

export const updateTokenRequestStatusSchema: FastifySchema = {
  description: "API for updating Token Request status",
  tags: ["TokenRequest"],
  params: {
    type: "object",
    properties: {
      tokenrequest_id: { type: "string" },
    },
    required: ["tokenrequest_id"],
  },
  body: {
    type: "object",
    properties: {
      status: {
        type: "string",
        enum: Object.values(TokenRequestStatus), // Using TokenRequestStatus enum values
      },
    },
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
