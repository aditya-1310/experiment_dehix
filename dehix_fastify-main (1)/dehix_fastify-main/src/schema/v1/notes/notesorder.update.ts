import { FastifySchema } from "fastify";
// Ensure this import is valid and used if necessary

export const updateNoteOrderSchema: FastifySchema = {
  description: "API to update the order of notes",
  summary: "Rearrange the order of notes for a user",
  tags: ["Notes"],
  body: {
    type: "object",
    properties: {
      userId: {
        type: "string",
        description: "The unique identifier for the user",
      },
      noteOrder: {
        type: "array",
        items: {
          type: "string",
          description: "Note IDs in the new order",
        },
        description: "An array representing the new order of notes",
      },
    },
    required: ["userId", "noteOrder"], // Required fields
  },
  response: {
    200: {
      description: "Successful operation",
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Note order updated successfully",
        },
      },
    },
    400: {
      description: "Invalid request parameters",
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Invalid userId or noteOrder",
        },
      },
    },
    500: {
      description: "Server encountered an error",
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Internal server error",
        },
      },
    },
  },
};
