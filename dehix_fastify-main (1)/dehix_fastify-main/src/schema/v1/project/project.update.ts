import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";
import { StatusEnum } from "../../../models/project.entity";

export const updateProjectSchema: FastifySchema = {
  description: "API to update project",
  tags: ["Project"],
  body: {
    type: "object",
    required: [
      "projectName",
      "description",
      "email",
      "companyName",
      "skillsRequired",
      "role",
      "projectType",
    ],
    properties: {
      _id: {
        type: "string",
        format: "uuid",
      },
      projectName: {
        type: "string",
      },
      description: {
        type: "string",
      },
      email: {
        type: "string",
      },
      verified: {
        type: "string",
      },
      isVerified: {
        type: "boolean",
        default: false,
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
        format: "date-time",
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
      totalNeedOfFreelancer: {
        type: "array",
        items: {
          type: "object",
          properties: {
            category: {
              type: "string",
            },
            needOfFreelancer: {
              type: "integer",
            },
            appliedCandidates: {
              type: "array",
              items: {
                type: "string",
              },
            },
            rejected: {
              type: "array",
              items: {
                type: "string",
              },
            },
            accepted: {
              type: "array",
              items: {
                type: "string",
              },
            },
            status: {
              type: "string",
            },
          },
        },
      },
      status: {
        type: "string",
        default: "Pending",
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
            email: { type: "string" },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const updateProjectStatusSchema: FastifySchema = {
  description: "API to update the status of a project",
  tags: ["Project"],
  body: {
    type: "object",
    required: ["status"],
    properties: {
      status: {
        type: "string",
        enum: Object.values(StatusEnum), // Use the enum for status
        default: "PENDING",
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
            status: { type: "string", enum: Object.values(StatusEnum) },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const updateBidDateSchema: FastifySchema = {
  description: "API to update bidding date of project",
  tags: ["Project"],
  params: {
    type: "object",
    properties: {
      project_id: {
        type: "string",
        description: "Project Id",
      },
    },
    required: ["project_id"],
  },
  body: {
    type: "object",
    properties: {
      maxBiddingDate: {
        type: "string",
        format: "date-time",
      },
      startBiddingDate: {
        type: "string",
        format: "date-time",
      },
    },
  },
  response: {
    ...commonErrorResponses,
  },
};
