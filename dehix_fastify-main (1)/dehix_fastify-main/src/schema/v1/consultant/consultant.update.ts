import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const updateConsultantSchema: FastifySchema = {
  description: "API to update consultant data for a freelancer",
  summary: "API to update consultant data for a freelancer",
  tags: ["Consultant"],
  params: {
    type: "object",
    properties: {
      consultant_id: { type: "string", format: "uuid" },
    },
    required: ["consultant_id"],
  },
  body: {
    type: "object",
    properties: {
      status: { type: "string" },
      description: { type: "string" },
      price: { type: "number" },
      experience: { type: "string" },
      links: {
        type: "array",
        items: { type: "string" },
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
        code: { type: "string" },
      },
    },
    ...commonErrorResponses,
  },
};
