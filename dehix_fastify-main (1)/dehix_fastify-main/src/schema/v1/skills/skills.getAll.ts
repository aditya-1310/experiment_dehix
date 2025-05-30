/**
 * File: get.ts
 * Author: Akhil
 * Date: 22-05-2024
 * Description:schema for API to get FREELANCER profile data
 */

import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const getSkillsSchema: FastifySchema = {
  description: "API to get all skills",
  tags: ["Skills"],
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
              _id: { type: "string" },
              label: { type: "string" },
              description: { type: "string" },
              createdBy: { type: "string" },
              createdById: { type: "string" },
              createdAt: {
                type: "string",
                format: "date-time",
              },
              status: { type: "string" },
            },
            required: ["_id", "label"],
          },
        },
      },
      ...commonErrorResponses,
    },
  },
};
