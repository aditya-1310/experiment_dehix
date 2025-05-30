import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const getConsultantSchema: FastifySchema = {
  description: "API to get consultant data freelance",
  summary: "API to get consultant data freelance",
  tags: ["Consultant"],
  params: {
    type: "object",
    properties: {
      consultant_id: { type: "string", format: "uuid" },
      freelancer_id: { type: "string" },
    },
    required: ["consultant_id", "freelancer_id"],
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            _id: { type: "string", format: "uuid" },
            consultant: {
              type: "object",
              additionalProperties: {
                type: "object",
                properties: {
                  _id: { type: "string", format: "uuid" },
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
            },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};
