import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const deleteFreelancerProjectSchema: FastifySchema = {
  description: "API to delete project of a freelancer",
  tags: ["Freelancer"],
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

export const deleteFreelancerSkillSchema: FastifySchema = {
  description: "API to delete a skill of a freelancer",
  tags: ["Freelancer"],
  params: {
    type: "object",
    properties: {
      skill_id: {
        type: "string",
        description: "The ID of the skill to be deleted",
      },
    },
    required: ["skill_id"],
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: { type: "object" },
      },
    },
    ...commonErrorResponses,
  },
};
export const deleteProfessionalInfoSchema: FastifySchema = {
  description: "API to delete professional information of a freelancer",
  tags: ["Freelancer"],
  params: {
    type: "object",
    properties: {
      experience_id: {
        type: "string",
        description: "The ID of the experience to be deleted",
      },
    },
    required: ["freelancer_id", "experience_id"],
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
    ...commonErrorResponses,
  },
};

export const deleteEducationSchema: FastifySchema = {
  description: "API to delete education data of a freelancer",
  tags: ["Freelancer"],
  params: {
    type: "object",
    properties: {
      education_id: {
        type: "string",
        description: "The ID of the education to be deleted",
      },
    },
    required: ["freelancer_id", "education_id"],
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
    ...commonErrorResponses,
  },
};

export const deleteFreelancerDomainSchema: FastifySchema = {
  description: "API to delete a domain of a freelancer",
  tags: ["Freelancer"],
  params: {
    type: "object",
    properties: {
      domain_id: {
        type: "string",
        description: "The ID of the domain to be deleted",
      },
    },
    required: ["domain_id"],
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: { type: "object" },
      },
    },
    ...commonErrorResponses,
  },
};

export const deleteDehixTalentFreelancerSchema: FastifySchema = {
  description: "API to delete professional information of a freelancer",
  tags: ["Freelancer"],
  params: {
    type: "object",
    properties: {
      dehixtalent_id: {
        type: "string",
        description: "The ID of the dehix talent to be deleted",
      },
    },
    required: ["dehixtalent_id"],
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
    ...commonErrorResponses,
  },
};
