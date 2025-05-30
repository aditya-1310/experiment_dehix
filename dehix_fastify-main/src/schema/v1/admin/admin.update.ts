import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";
import { PasswordStatus } from "../../../models/admin.entity";
// Import enums
export const updateAdminSchema: FastifySchema = {
  description: "API endpoint for updating an Admin user.",
  tags: ["Admin"],
  summary: "Update the details of Admin user.",
  body: {
    type: "object",
    required: [],
    properties: {
      firstName: {
        type: "string",
      },
      lastName: {
        type: "string",
      },
      password: {
        type: "string",
      },
      profilePic: {
        type: "string",
      },
      userName: {
        type: "string",
      },
      email: {
        type: "string",
      },
      phone: {
        type: "string",
      },
      status: {
        type: "string",
      },
      resetRequest: {
        type: "boolean",
        description: "Indicates whether a password reset request is active.",
      },
      changePasswordRequests: {
        type: "array",
        items: {
          type: "object",
          properties: {
            passwordStatus: {
              type: "string",
              enum: Object.values(PasswordStatus),
              description: "Status of the password change request.",
            },
            acceptedBy: {
              type: "string",
              description: "The ID of the admin who accepted the request.",
            },
          },
        },
        description: "List of password change requests made by the admin.",
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
