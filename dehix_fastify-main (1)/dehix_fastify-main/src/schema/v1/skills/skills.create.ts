import { FastifySchema } from "fastify";
import { SkillStatus } from "../../../models/skills.entity"; // Assuming the SkillStatus enum is imported
import { commonErrorResponses } from "../commonErrorCodes";

export const createSkillSchema: FastifySchema = {
  description: "API for creating a new skill.",
  tags: ["Skills"],
  summary: "Creates a new skill with label, description, and status.",
  body: {
    type: "object",
    properties: {
      label: { type: "string", description: "The name of the skill." },
      description: { type: "string", description: "Description of the skill." },
      createdBy: {
        type: "string",
        description: "Type of the user who created the skill.",
      },
      createdById: {
        type: "string",
        description: "ID of the user who created the skill.",
      },
      status: {
        type: "string",
        enum: Object.values(SkillStatus), // Use enum values from SkillStatus
        description: "The status of the skill. Defaults to 'active'.",
      },
    },
    required: ["label"], // Only 'label' is required
  },
  response: {
    200: {
      description: "Successfully created a new skill.",
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "The unique identifier for the skill.",
            },
            label: {
              type: "string",
              description: "The label/name of the skill.",
            },
            description: {
              type: "string",
              description: "Description of the skill.",
            },
            status: {
              type: "string",
              enum: Object.values(SkillStatus),
              description: "The status of the skill.",
            },
            createdBy: {
              type: "string",
              description: "Type of the user who created the skill.",
            },
            createdById: {
              type: "string",
              description: "Id of the user who created the skill.",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the skill was created.",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the skill was last updated.",
            },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};
