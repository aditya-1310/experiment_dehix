import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const updateResumeSchema: FastifySchema = {
  description: "API for update the resume data",
  summary: "API for update the resume data",
  tags: ["Resume"],
  body: {
    type: "object",
    properties: {
      userId: { type: "string" },
      personalInfo: {
        type: "object",
        properties: {
          firstName: { type: "string", nullable: true },
          lastName: { type: "string", nullable: true },
          email: { type: "string", format: "email", nullable: true },
          phone: { type: "string", nullable: true },
          country: { type: "string", nullable: true },
          linkedin: { type: "string", nullable: true },
          github: { type: "string", nullable: true },
        },
        nullable: true,
      },
      workExperience: {
        type: "array",
        items: {
          type: "object",
          properties: {
            jobTitle: { type: "string", nullable: true },
            company: { type: "string", nullable: true },
            startDate: { type: "string", format: "date", nullable: true },
            endDate: { type: "string", format: "date", nullable: true },
            description: { type: "string", nullable: true },
          },
        },
        nullable: true,
      },
      skills: { type: "array", items: { type: "string" }, nullable: true },
      education: {
        type: "array",
        items: {
          type: "object",
          properties: {
            degree: { type: "string" },
            school: { type: "string" },
            startDate: { type: "string", format: "date" },
            endDate: { type: "string", format: "date" },
            grade: { type: "string", format: "date" },
          },
        },
        nullable: true,
      },
      professionalSummary: { type: "string", nullable: true },
      projects: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
          },
        },
        nullable: true,
      },
      selectedTemplate: { type: "string", nullable: true },
    },
    required: [],
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
        updatedResume: { type: "object" }, // Add schema for the updated resume here if needed
      },
    },
    ...commonErrorResponses,
  },
};
