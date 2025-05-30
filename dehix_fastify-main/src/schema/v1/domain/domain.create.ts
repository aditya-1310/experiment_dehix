import { FastifySchema } from "fastify";
import { DomainStatus } from "../../../models/domain.entity"; // Assuming the DomainStatus enum is imported
import { commonErrorResponses } from "../commonErrorCodes";

export const createDomainSchema: FastifySchema = {
  description: "API for creating a new domain.",
  tags: ["Domain"],
  summary: "Creates a new domain with label, description, and status.",
  body: {
    type: "object",
    properties: {
      label: { type: "string", description: "The label/name of the domain." },
      description: {
        type: "string",
        description: "Description of the domain.",
      },
      createdBy: {
        type: "string",
        description: "Type of the user who created the domain.",
      },
      createdById: {
        type: "string",
        description: "ID of the user who created the domain.",
      },
      status: {
        type: "string",
        enum: Object.values(DomainStatus), // Use enum values from DomainStatus
        description: "The status of the domain. Defaults to 'active'.",
      },
    },
    required: ["label"], // Only 'label' is required
  },
  response: {
    200: {
      description: "Successfully created a new domain.",
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "The unique identifier for the domain.",
            },
            label: {
              type: "string",
              description: "The label/name of the domain.",
            },
            description: {
              type: "string",
              description: "Description of the domain.",
            },
            status: {
              type: "string",
              enum: Object.values(DomainStatus),
              description: "The status of the domain.",
            },
            createdBy: {
              type: "string",
              description: "Type of the user who created the domain.",
            },
            createdById: {
              type: "string",
              description: "Id of the user who created the domain.",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the domain was created.",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the domain was last updated.",
            },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};
