import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const createProjectSchema: FastifySchema = {
  description: "API to create project data",
  tags: ["Project"],
  body: {
    type: "object",
    required: [
      "projectName",
      "description",
      "email",
      "skillsRequired",
      "role",
      "projectType",
    ],
    properties: {
      projectName: {
        type: "string",
      },
      projectDomain: {
        type: "array",
        items: {
          type: "string",
        },
      },
      description: {
        type: "string",
      },
      companyId: {
        type: "string",
      },
      email: {
        type: "string",
      },
      verified: {
        type: "string",
      },
      isVerified: {
        type: "string",
      },
      companyName: {
        type: "string",
      },
      start: {
        type: "string",
        format: "date-time",
      },
      end: {
        type: "string",
      },
      skillsRequired: {
        type: "array",
        items: {
          type: "string",
        },
      },
      experience: {
        type: "string",
      },
      role: {
        type: "string",
      },
      projectType: {
        type: "string",
      },
      url: {
        type: "array",
        items: {
          type: "object",
          properties: {
            value: {
              type: "string",
            },
          },
        },
      },
      profiles: {
        type: "array",
        items: {
          type: "object",
          properties: {
            domain: { type: "string" },
            freelancersRequired: { type: "string" },
            skills: {
              type: "array",
              items: {
                type: "string",
              },
            },
            experience: { type: "integer" },
            minConnect: { type: "integer" },
            rate: { type: "integer" },
            description: { type: "string" },
            domain_id: { type: "string" },
          },
        },
      },
      status: {
        type: "string",
        enum: ["ACTIVE", "PENDING", "COMPLETED", "REJECTED"],
        default: "PENDING",
      },
      team: {
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
            companyId: { type: "string" },
            email: { type: "string" },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};
