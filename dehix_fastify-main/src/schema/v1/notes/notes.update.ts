import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";
import {
  LabelType,
  NotesEntityType,
  NoteType,
} from "../../../models/notes.entity";

export const updateNotesSchema: FastifySchema = {
  description: "API for updating a note",
  summary: "API to Update notes",
  tags: ["Notes"],
  body: {
    type: "object",
    properties: {
      title: { type: "string" },
      content: { type: "string" },
      bgColor: { type: "string", default: "#FFFFFF" },
      banner: { type: "string", default: "" },
      isHTML: { type: "boolean", default: false },
      entityID: { type: "string", default: "" },
      entityType: {
        type: "string",
        enum: Object.values(NotesEntityType),
        nullable: true,
      },
      noteType: {
        type: "string",
        enum: Object.values(NoteType),
        default: "note",
      },
      type: {
        type: "string",
        enum: Object.values(LabelType),
        nullable: true,
      },
    },
    required: ["title", "content"], // Enforce mandatory fields if needed
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            noteID: { type: "string" },
            title: { type: "string" },
            content: { type: "string" },
            bgColor: { type: "string" },
            banner: { type: "string" },
            isHTML: { type: "boolean" },
            entityID: { type: "string" },
            entityType: { type: "string" },
            noteType: { type: "string" },
            type: { type: "string" },
          },
          additionalProperties: false, // Ensure no extra properties
        },
      },
    },
    ...commonErrorResponses,
  },
};
