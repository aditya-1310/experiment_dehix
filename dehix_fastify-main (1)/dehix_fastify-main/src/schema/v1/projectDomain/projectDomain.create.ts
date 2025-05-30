import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";
import { ProjectDomainStatus } from "../../../models/projectDomain.entity"; // Assuming the SkillStatus enum is imported

export const createProjectDomainSchema: FastifySchema = {
  description: "API for creating Project-Domain",
  tags: ["Project Domain"],
  body: {
    type: "object",
    properties: {
      label: { type: "string" },
      description: { type: "string" },
      status: {
        type: "string",
        enum: Object.values(ProjectDomainStatus),
        description: "The status of the project domain. Defaults to 'active'.",
      },
      createdBy: {
        type: "string",
        description: "Type of the user who created the project domain.",
      },
      createdById: {
        type: "string",
        description: "ID of the user who created the project domain.",
      },
    },
    required: ["label"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            _id: { type: "string" },
            label: { type: "string" },
            description: { type: "string" },
            status: {
              type: "string",
              enum: Object.values(ProjectDomainStatus),
              description: "The status of the project domain.",
            },
            createdBy: {
              type: "string",
              description: "Type of the user who created the project domain.",
            },
            createdById: {
              type: "string",
              description: "Id of the user who created the project domain.",
            },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};
