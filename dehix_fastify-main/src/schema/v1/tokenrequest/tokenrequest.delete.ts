import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const deleteTokenRequestSchema: FastifySchema = {
  description: "API for deleting Token Request",
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
        message: { type: "string" },
      },
    },
    ...commonErrorResponses,
  },
};
