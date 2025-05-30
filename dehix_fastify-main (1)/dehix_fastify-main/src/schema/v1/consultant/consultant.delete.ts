import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const deleteConsultantSchema: FastifySchema = {
  description: "API to delete consultant data freelance",
  summary: "API to delete consultant data freelance",
  tags: ["Consultant"],
  params: {
    type: "object",
    properties: {
      consultant_id: { type: "string", format: "uuid" },
    },
    required: ["consultant_id"],
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
