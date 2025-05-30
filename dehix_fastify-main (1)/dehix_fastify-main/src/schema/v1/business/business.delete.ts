import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const deleteHireFreelancerSchema: FastifySchema = {
  description: "API to delete project freelancer",
  summary: "API to delete project freelancer",
  tags: ["Business"],
  body: {
    type: "object",
    properties: {
      freelancer: {
        type: "string",
        format: "freelancer_id",
      },
    },
    required: ["freelancer"],
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            email: { type: "string" },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};
