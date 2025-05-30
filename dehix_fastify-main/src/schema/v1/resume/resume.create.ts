import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const createResumeSchema: FastifySchema = {
  description: "API endpoint for creating resume.",
  tags: ["Resume"],
  summary: "Create a new Resume",
  body: {
    type: "object",
    required: [
      "userId",
      "personalInfo",
      "professionalSummary",
      "workExperience",
      "education",
      "skills",
    ],
    properties: {
      userId: { type: "string" },
      personalInfo: {
        type: "object",
        required: ["firstName", "lastName", "email", "phone"],
        properties: {
          firstName: { type: "string" },
          lastName: { type: "string" },
          email: { type: "string", format: "email" },
          phone: { type: "string" },
          city: { type: "string", nullable: true },
          linkedIn: { type: "string", nullable: true },
          github: { type: "string", nullable: true },
        },
      },
      professionalSummary: { type: "string" },
      workExperience: {
        type: "array",
        items: {
          type: "object",
          required: ["jobTitle", "company", "startDate", "description"],
          properties: {
            jobTitle: { type: "string" },
            company: { type: "string" },
            startDate: { type: "string", format: "date" },
            endDate: { type: "string", format: "date", nullable: true },
            description: { type: "string" },
          },
        },
      },
      education: {
        type: "array",
        items: {
          type: "object",
          required: ["degree", "school"],
          properties: {
            degree: { type: "string" },
            school: { type: "string" },
            startDate: { type: "string", format: "date" },
            endDate: { type: "string", format: "date", nullable: true },
            grade: { type: "string", nullable: true },
          },
        },
      },
      skills: { type: "array", items: { type: "string" } },
      certifications: {
        type: "array",
        nullable: true,
        items: {
          type: "object",
          required: ["name", "issuingOrganization", "issueDate"],
          properties: {
            name: { type: "string" },
            issuingOrganization: { type: "string" },
            issueDate: { type: "string", format: "date" },
            expirationDate: { type: "string", format: "date", nullable: true },
          },
        },
      },
      projects: {
        type: "array",
        nullable: true,
        items: {
          type: "object",
          required: ["title", "description"],
          properties: {
            title: { type: "string" },
            description: { type: "string" },
          },
        },
      },
      selectedTemplate: { type: "string", nullable: true },
      selectedColor: { type: "string", nullable: true },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
        resume: {
          type: "object",
          properties: {
            userId: { type: "string" },
            personalInfo: { type: "object" },
            professionalSummary: { type: "string" },
            workExperience: { type: "array" },
            education: { type: "array" },
            skills: { type: "array" },
            certifications: { type: "array", nullable: true },
            projects: { type: "array", nullable: true },
            selectedTemplate: { type: "string", nullable: true },
            // selectedColor: { type: "string", nullable: true },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};
