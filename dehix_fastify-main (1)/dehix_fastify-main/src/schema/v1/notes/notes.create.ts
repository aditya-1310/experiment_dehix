import { FastifySchema } from "fastify";
import {
  LabelType,
  NotesEntityType,
  NoteType,
} from "../../../models/notes.entity";

import { commonErrorResponses } from "../commonErrorCodes";

export const createNotesSchema: FastifySchema = {
  description: "API for creating notes",
  summary: "API to Create notes",
  tags: ["Notes"],
  body: {
    type: "object",
    required: ["title", "content", "userId"],
    properties: {
      userId: {
        type: "string",
      },
      title: {
        type: "string",
      },
      content: {
        type: "string",
      },
      banner: {
        type: "string",
        default: "",
      },
      bgColor: {
        type: "string",
        default: "#FFFFFF",
      },
      isHTML: {
        type: "boolean",
        default: false,
      },
      entityID: {
        type: "string",
      },
      entityType: {
        type: "string",
        enum: Object.values(NotesEntityType), // Ensure alignment with `noteSchema`
      },
      noteType: {
        type: "string",
        enum: Object.values(NoteType), // Ensure alignment with `noteSchema`
        default: "note",
      },
      type: {
        type: "string",
        enum: Object.values(LabelType), // Ensure alignment with `noteSchema`
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            content: { type: "string" },
            banner: { type: "string" },
            bgColor: { type: "string" },
            isHTML: { type: "boolean" },
            entityID: { type: "string" },
            entityType: { type: "string" },
            noteType: { type: "string" },
            type: { type: "string" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};
