import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const updateProjectProfileByIdSchema: FastifySchema = {
  description: "API for updating a project profile by ID",
  tags: ["Profiles"],
  params: {
    type: "object",
    properties: {
      project_id: { type: "string" },
      profile_id: { type: "string" },
    },
    required: ["project_id", "profile_id"],
  },
  body: {
    type: "object",
    properties: {
      domain: { type: "string" },
      freelancersRequired: { type: "string" },
      skills: { type: ["string"] },
      experience: { type: "number" },
      minConnect: { type: "number" },
      rate: { type: "number" },
      description: { type: "string" },
      domain_id: { type: "string" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
        data: { type: "object" },
      },
    },
    ...commonErrorResponses,
  },
};
