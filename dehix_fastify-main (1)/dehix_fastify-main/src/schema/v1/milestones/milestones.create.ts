import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";
import { MilestoneStatus } from "../../../models/milestones.entity";

export const createMilestoneSchema: FastifySchema = {
  description: "API to create a milestone",
  summary: "Create a Milestone",
  tags: ["Milestones"],
  body: {
    type: "object",
    required: [
      "title",
      "startDate",
      "endDate",
      "amount",
      "status",
      "projectId",
      "userId",
    ],
    properties: {
      userId: { type: "string" },
      projectId: { type: "string" },
      title: { type: "string" },
      description: { type: "string" },
      startDate: {
        type: "object",
        properties: {
          expected: { type: "string", format: "date-time" },
          actual: { type: "string", format: "date-time", nullable: true },
        },
        required: ["expected"],
      },
      endDate: {
        type: "object",
        properties: {
          expected: { type: "string", format: "date-time" },
          actual: { type: "string", format: "date-time", nullable: true },
        },
        required: ["expected"],
      },
      amount: { type: "number" },
      status: {
        type: "string",
        enum: Object.values(MilestoneStatus),
        default: MilestoneStatus.NOT_STARTED,
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            startDate: {
              type: "object",
              properties: {
                expected: { type: "string" },
                actual: { type: "string" },
              },
            },
            endDate: {
              type: "object",
              properties: {
                expected: { type: "string" },
                actual: { type: "string" },
              },
            },
            amount: { type: "number" },
            status: { type: "string" },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};
