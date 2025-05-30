import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const deleteFaqSchema: FastifySchema = {
  description: "API to delete a Faq",
  summary: "API to delete a Faq",
  tags: ["Faq"],
  params: {
    type: "object",
    properties: {
      faq_id: {
        type: "string",
        description: "The ID of the faq",
      },
    },
    required: ["faq_id"],
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
