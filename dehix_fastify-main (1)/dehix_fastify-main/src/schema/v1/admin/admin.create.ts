import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";
import { AdminStatus, AdminType } from "../../../models/admin.entity"; // Import enums

export const createAdminSchema: FastifySchema = {
  description: "API endpoint for creating a new Admin user.",
  tags: ["Admin"],
  summary: "Create a new Admin user with required details.",
  body: {
    type: "object",
    description: "The payload containing admin details for creation.",
    properties: {
      firstName: {
        type: "string",
        description: "The first name of the admin.",
      },
      lastName: {
        type: "string",
        description: "The last name of the admin.",
      },
      userName: {
        type: "string",
        description: "The username for the admin (unique identifier).",
      },
      email: {
        type: "string",
        format: "email",
        description: "The email address of the admin (must be valid).",
      },
      password: {
        type: "string",
        description: "The password for the admin account. ",
      },
      phone: {
        type: "string",
        description: "The contact phone number of the admin.",
      },
      status: {
        type: "string",
        enum: Object.values(AdminStatus), // Use AdminStatus enum values
        description: "The current status of the admin. Defaults to 'Pending'.",
        default: AdminStatus.PENDING, // Set default value to PENDING
      },
      type: {
        type: "string",
        enum: Object.values(AdminType), // Use AdminType enum values
        description:
          "The type of admin being created. Either 'Admin' or 'Super_Admin'.",
        default: AdminType.ADMIN, // Set default value to ADMIN
      },
    },
    required: ["firstName", "lastName", "userName", "email", "password"],
  },
  response: {
    200: {
      description: "Successful creation of an admin user.",
      type: "object",
      properties: {
        data: {
          type: "object",
          description: "Details of the newly created admin.",
          properties: {
            _id: {
              type: "string",
              description: "The unique identifier for the admin.",
            },

            firstName: {
              type: "string",
              description: "The first name of the admin.",
            },
            lastName: {
              type: "string",
              description: "The last name of the admin.",
            },
            userName: {
              type: "string",
              description: "The username of the admin.",
            },
            email: {
              type: "string",
              description: "The email address of the admin.",
            },
            password: {
              type: "string",
              description: "The password for the admin account. ",
            },
            phone: {
              type: "string",
              description: "The contact phone number of the admin.",
            },
            status: {
              type: "string",
              enum: Object.values(AdminStatus), // Use AdminStatus enum values
              description: "The current status of the admin.",
            },
            type: {
              type: "string",
              enum: Object.values(AdminType), // Use AdminType enum values
              description: "The type of admin (Admin or Super_Admin).",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "The timestamp when the admin was created.",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description:
                "The timestamp when the admin record was last updated.",
            },
          },
        },
      },
    },
    ...commonErrorResponses, // Include common error responses
  },
};
