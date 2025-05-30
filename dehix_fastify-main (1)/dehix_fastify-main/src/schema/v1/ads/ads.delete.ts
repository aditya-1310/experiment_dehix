import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const deleteAdsSchema: FastifySchema = {
  description: "API for deleting a Ads by ID",
  summary: "API for deleting a Ads by ID",
  tags: ["Ads"],
  params: {
    type: "object",
    properties: {
      ads_id: {
        type: "string",
        description: "The ID of the ads",
      },
    },
    required: ["ads_id"],
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
