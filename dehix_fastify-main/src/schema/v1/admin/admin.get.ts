import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const getAllAdminSchema: FastifySchema = {
  description: "API endpoint to retrieve a list of all admin users.",
  tags: ["Admin"],
  summary: "Fetch all admins with their basic details.",
  response: {
    200: {
      description: "Successfully retrieved the list of all admin users.",
      type: "object",
      properties: {
        data: {
          type: "array",
          description: "List of admin users.",
          items: {
            type: "object",
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
              phone: {
                type: "string",
                description: "The contact phone number of the admin.",
              },
              status: {
                type: "string",
                enum: ["Pending", "Accept", "Reject"],
                description: "The current status of the admin.",
              },
              type: {
                type: "string",
                enum: ["Admin", "Super_Admin"],
                description: "The type of admin user.",
              },
              changePasswordRequests: {
                type: "array",
                description: "List of password change requests.",
                items: {
                  type: "object",
                  properties: {
                    requestedAt: {
                      type: "string",
                      format: "date-time",
                      description: "The time the change was requested.",
                    },
                    passwordStatus: {
                      type: "string",
                      enum: ["COMPLETED", "PENDING"],
                      description: "Status of the password change request.",
                    },
                    acceptedBy: {
                      type: "string",
                      description:
                        "ID of the admin who accepted the request (optional).",
                    },
                  },
                },
              },
              resetRequest: {
                type: "boolean",
                description: "Indicates if a password reset was requested.",
                default: false,
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
                  "The timestamp when the admin data was last updated.",
              },
            },
            example: {
              _id: "60d5f8c8e8c8e10004362f72",
              firstName: "John",
              lastName: "Doe",
              userName: "johndoe",
              email: "john.doe@example.com",
              phone: "+1234567890",
              status: "Accept",
              type: "Admin",
              changePasswordRequests: [
                {
                  requestedAt: "2024-01-20T12:00:00Z",
                  passwordStatus: "Pending",
                  acceptedBy: "60d5f8c8e8c8e10004362f72",
                },
              ],
              resetRequest: false,
              createdAt: "2023-07-01T12:00:00Z",
              updatedAt: "2023-07-01T12:00:00Z",
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

export const getAdminByIdSchema: FastifySchema = {
  description:
    "API endpoint to retrieve details of a specific admin by their unique ID.",
  tags: ["Admin"],
  summary: "Fetch details of an admin by their ID.",
  params: {
    type: "object",
    description: "Parameters for retrieving an admin by ID.",
    properties: {
      admin_id: {
        type: "string",
        description: "The unique identifier (ID) of the admin to be retrieved.",
      },
    },
    required: ["admin_id"],
  },
  response: {
    200: {
      description: "Successfully retrieved the admin details.",
      type: "object",
      properties: {
        data: {
          type: "object",
          description: "Admin details.",
          properties: {
            _id: {
              type: "string",
              description: "The unique identifier for the admin.",
            },
            profilePic: {
              type: "string",
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
            phone: {
              type: "string",
              description: "The contact phone number of the admin.",
            },
            status: {
              type: "string",
              enum: ["Pending", "Accept", "Reject"],
              description: "The current status of the admin.",
            },
            type: {
              type: "string",
              enum: ["Admin", "Super_Admin"],
              description: "The type of admin user.",
            },
            changePasswordRequests: {
              type: "array",
              description: "List of password change requests.",
              items: {
                type: "object",
                properties: {
                  requestedAt: {
                    type: "string",
                    format: "date-time",
                    description: "The time the change was requested.",
                  },
                  passwordStatus: {
                    type: "string",
                    description: "Status of the password change request.",
                  },
                  acceptedBy: {
                    type: "string",
                    description:
                      "ID of the admin who accepted the request (optional).",
                  },
                },
              },
            },
            resetRequest: {
              type: "boolean",
              description: "Indicates if a password reset was requested.",
              default: false,
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
                "The timestamp when the admin data was last updated.",
            },
          },
          example: {
            _id: "60d5f8c8e8c8e10004362f72",
            firstName: "Jane",
            lastName: "Smith",
            userName: "janesmith",
            email: "jane.smith@example.com",
            phone: "+9876543210",
            status: "Accept",
            type: "Super_Admin",
            changePasswordRequests: [
              {
                requestedAt: "2024-01-20T12:00:00Z",
                passwordStatus: "Pending",
                acceptedBy: "60d5f8c8e8c8e10004362f72",
              },
            ],
            resetRequest: false,
            createdAt: "2023-06-15T10:30:00Z",
            updatedAt: "2023-06-15T10:30:00Z",
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};
