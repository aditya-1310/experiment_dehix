import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const getAllProjectDomainSchema: FastifySchema = {
  description: "API to get all projectDomain",
  tags: ["Project Domain"],
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: {
                type: "string",
              },
              label: {
                type: "string",
              },
              description: {
                type: "string",
              },
              status: {
                type: "string",
              },
              createdBy: {
                type: "string",
              },
              createdById: {
                type: "string",
              },
            },
            required: ["_id", "label"],
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};
