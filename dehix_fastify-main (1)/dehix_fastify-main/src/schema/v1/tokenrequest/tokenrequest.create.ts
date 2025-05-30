import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";
import {
  TokenRequestStatus,
  UserType,
} from "../../../models/tokenrequest.entity";

export const createTokenRequestSchema: FastifySchema = {
  description: "API for creating Token Request",
  tags: ["TokenRequest"],
  body: {
    type: "object",
    properties: {
      userId: {
        type: "string",
      },
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
    required: ["userId", "userType", "dateTime"],
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
