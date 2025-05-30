import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const getUserById: FastifySchema = {
  description: "API endpoint to retrieve a list of users by their id's.",
  tags: ["Public"],
  summary: "Fetch user with their basic details.",
  querystring: {
    type: "object",
    properties: {
      user_ids: {
        type: "string",
        description: "An array of user IDs.",
      },
    },
  },
  response: {
    200: {
      description: "Successful response with user names and IDs",
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              displayName: { type: "string" },
              email: { type: "string" },
              profilePic: { type: "string" },
              phoneVerify: { type: "boolean" },
            },
          },
        },
      },
    },
    400: {
      description: "Bad request due to invalid input.",
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Invalid request format.",
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const getUserByUserName: FastifySchema = {
  description: "API endpoint to retrieve a list of users by their user name.",
  tags: ["Public"],
  summary: "Fetch user with their details.",
  querystring: {
    type: "object",
    properties: {
      username: {
        type: "string",
        description: "user name or company name of user.",
      },
    },
  },
  response: {
    400: {
      description: "Bad request due to invalid input.",
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Invalid request format.",
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const getUserByEmail: FastifySchema = {
  description: "API endpoint to retrieve a user by their email.",
  tags: ["Public"],
  summary: "Fetch user with their details using email.",
  querystring: {
    type: "object",
    properties: {
      user: {
        type: "string",
        format: "email",
        description: "Email of the user to be retrieved.",
      },
    },
    required: ["user"],
  },
  response: {
    200: {
      description: "Successful response with user details",
      type: "object",
      properties: {
        _id: { type: "string" },
        userName: { type: "string" },
        email: { type: "string" },
        profilePic: { type: "string", nullable: true },
        phone: { type: "string", nullable: true },
        phoneVerify: { type: "boolean", nullable: true },
      },
    },
    400: {
      description: "Bad request due to invalid input.",
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Invalid request format.",
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const checkDuplicateUserName: FastifySchema = {
  description: "API to check if the username already exists",
  tags: ["Public"],
  querystring: {
    type: "object",
    properties: {
      username: { type: "string" },
      is_freelancer: { type: "boolean" },
      is_business: { type: "boolean" },
    },
    required: ["username"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        duplicate: { type: "boolean" },
      },
    },
    ...commonErrorResponses,
  },
};
