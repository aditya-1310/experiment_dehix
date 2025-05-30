import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const createConsultantSchema: FastifySchema = {
  description: "API to create consultant data in freelancer",
  summary: "API to create consultant data in freelancer",
  tags: ["Consultant"],
  body: {
    type: "object",
    required: [],
    properties: {
      status: {
        type: "string",
      },
      description: {
        type: "string",
      },
      price: {
        type: "number",
      },
      experience: {
        type: "string",
      },
      links: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
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
    ...commonErrorResponses,
  },
};
