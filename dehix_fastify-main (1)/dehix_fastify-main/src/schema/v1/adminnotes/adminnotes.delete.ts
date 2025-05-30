import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const deleteAdminNotesSchema: FastifySchema = {
  description: "API to delete notes",
  summary: "API to delete notes",
  tags: ["Admin Notes"],
  body: {
    type: "object",
    properties: {
      note_id: {
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
