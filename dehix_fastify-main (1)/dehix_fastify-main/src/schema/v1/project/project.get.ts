import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const getProjectSchema: FastifySchema = {
  description: "API to get Project profile data",
  tags: ["Project"],
  querystring: {
    type: "object",
    properties: {
      location: {
        type: "string",
        description: "Comma-separated list of locations",
      },
      jobType: {
        type: "string",
        description: "Comma-separated list of job types",
      },
      domain: {
        type: "string",
        description: "Comma-separated list of domains",
      },
      skills: {
        type: "string",
        description: "Comma-separated list of skills",
      },
      page: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      projectDomain: {
        type: "string",
        description: "Comma-separated list of projectDomain",
      },
    },
  },
  response: {
    // TODO: Add 200 response schema
    ...commonErrorResponses,
  },
};

export const getAllProjectsSchema: FastifySchema = {
  description: "API to get all projects",
  tags: ["Project"],
  response: {
    // TODO: Add 200 response schema
    ...commonErrorResponses,
  },
};

export const getProjectFreelancers: FastifySchema = {
  description: "API to get Project and Freelancers data",
  tags: ["Project"],
  params: {
    type: "object",
    properties: {
      projectId: {
        type: "string",
        description: "Unique identifier for the project",
      },
    },
    required: ["projectId"],
  },
  response: {
    ...commonErrorResponses,
  },
};

export const getProjectsAndBidsSchema: FastifySchema = {
  description: "API to get Project and Bids data",
  tags: ["Project"],
  response: {
    // TODO: Add 200 response schema
    ...commonErrorResponses,
  },
};
