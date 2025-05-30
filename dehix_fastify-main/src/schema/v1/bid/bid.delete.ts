import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const deleteBidSchema: FastifySchema = {
  description: "API to delete Bid",
  summary: "API to delete Bid",
  tags: ["Bid"],
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        message: {
          type: "string",
        },
        code: {
          type: "string",
        },
      },
    },
    ...commonErrorResponses,
  },
};
