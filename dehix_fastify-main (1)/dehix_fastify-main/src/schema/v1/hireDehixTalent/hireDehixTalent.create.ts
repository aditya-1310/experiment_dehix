import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";
import { HireDehixTalentStatusEnum } from "../../../models/hireDehixTalent.entity";

export const createhireDehixTalentSchema: FastifySchema = {
  description: "API to create project data",
  tags: ["Hire"],
  body: {
    type: "object",
    properties: {
      businessId: {
        type: "string",
      },
      domainId: {
        type: "string",
      },
      domainName: {
        type: "string",
      },
      skillId: {
        type: "string",
      },
      skillName: {
        type: "string",
      },
      description: {
        type: "string",
      },
      experience: {
        type: "string",
      },
      status: {
        type: "string",
        enum: Object.values(HireDehixTalentStatusEnum),
        default: HireDehixTalentStatusEnum.ADDED,
      },
      visible: {
        type: "boolean",
      },
      freelancerRequired: {
        type: "number",
        default: 1,
      },
      freelancerInLobby: {
        type: "array",
        items: {
          type: "object",
          properties: {
            freelancerId: {
              type: "string",
            },
            dehixTalentId: {
              type: "string",
            },
          },
        },
      },
      freelancerSelected: {
        type: "array",
        items: {
          type: "object",
          properties: {
            freelancerId: {
              type: "string",
            },
            dehixTalentId: {
              type: "string",
            },
          },
        },
      },
    },
    required: ["businessId", "description", "experience", "status"],
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            _id: { type: "string" },
            BusinessId: {
              type: "string",
            },
            domainId: {
              type: "string",
            },
            domainName: {
              type: "string",
            },
            skillId: {
              type: "string",
            },
            skillName: {
              type: "string",
            },
            description: {
              type: "string",
            },
            experience: {
              type: "string",
            },
            status: {
              type: "string",
              enum: Object.values(HireDehixTalentStatusEnum),
            },
            visible: {
              type: "boolean",
            },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const addTalentIntoLobbySchema: FastifySchema = {
  description: "API to add talent into lobby data",
  tags: ["Hire"],
  body: {
    type: "object",
    properties: {
      freelancerId: { type: "string" },
      dehixTalentId: {
        type: "array",
        items: { type: "string" },
      },
      hireDehixTalent_id: {
        type: "array",
        items: { type: "string" },
      },
    },
    required: ["freelancerId", "dehixTalentId", "hireDehixTalent_id"],
  },
  response: {
    // TODO: Add 200 response schema
    ...commonErrorResponses,
  },
};
