import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const deleteAdminSchema: FastifySchema = {
  description: "API endpoint to delete an admin user based on their unique ID.",
  tags: ["Admin"],
  summary: "Delete an admin user by their unique ID.",
  params: {
    type: "object",
    description: "Parameters required for deleting an admin.",
    properties: {
      admin_id: {
        type: "string",
        description: "The unique identifier (ID) of the admin to be deleted.",
      },
    },
    required: ["admin_id"],
  },
  response: {
    200: {
      description: "Successfully deleted the admin user.",
      type: "object",
      properties: {
        message: {
          type: "string",
          description:
            "Confirmation message indicating the deletion was successful.",
          example: "Admin user deleted successfully.",
        },
      },
    },
    400: {
      description: "Bad request - invalid admin ID.",
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "Error message describing the invalid request.",
          example: "Invalid admin ID format.",
        },
      },
    },
    ...commonErrorResponses,
  },
};
