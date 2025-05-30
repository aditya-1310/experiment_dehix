import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const deleteNotesSchema: FastifySchema = {
  description: "API to delete notes",
  summary: "API to delete notes",
  tags: ["Notes"],
  params: {
    type: "object",
    properties: {
      noteId: {
        type: "string",
        description: "The ID of the note",
      },
    },
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
