import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const getProjectProfileByIdSchema: FastifySchema = {
  description: "API for getting a project profile by ID",
  tags: ["Profiles"],
  params: {
    type: "object",
    properties: {
      project_id: { type: "string" },
      profile_id: { type: "string" },
    },
    required: ["project_id", "profile_id"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            _id: { type: "string" },
            profiles: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  _id: { type: "string" },
                  domain: { type: "string" },
                  freelancersRequired: { type: "string" },
                  skills: {
                    type: "array",
                    items: { type: "string" },
                  },
                  experience: { type: "number" },
                  minConnect: { type: "number" },
                  rate: { type: "number" },
                  description: { type: "string" },
                  domain_id: { type: "string" },
                  selectedFreelancer: {
                    type: "array",
                    items: { type: "string" },
                  },
                  totalBid: {
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
