import { commonErrorResponses as commonErrorCodes } from "../commonErrorCodes";

export const voiceMessageUploadSchema = {
  summary: "Upload a voice message",
  description:
    "Uploads an audio file as a voice message and associates it with a conversation.",
  tags: ["Voice Messages"],
  consumes: ["multipart/form-data"],
  produces: ["application/json"],
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: ["senderId", "receiverId", "conversationId", "duration"],
    properties: {
      senderId: { type: "string", description: "ID of the message sender." },
      receiverId: {
        type: "string",
        description: "ID of the message receiver (user or group).",
      },
      conversationId: {
        type: "string",
        description: "ID of the conversation.",
      },
      duration: {
        type: "string",
        description: "Duration of the voice message in seconds.",
      },
    },
  },
  response: {
    201: {
      description: "Voice message uploaded successfully.",
      type: "object",
      properties: {
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "string" },
            senderId: { type: "string" },
            receiverId: { type: "string" },
            conversationId: { type: "string" },
            audioUrl: { type: "string" },
            duration: { type: "number" },
            timestamp: { type: "string", format: "date-time" },
          },
        },
      },
    },
    400: {
      description:
        "Bad Request - Missing fields, invalid file type, or other validation errors.",
      type: "object",
      properties: {
        error: { type: "string" },
        details: { type: "string", nullable: true },
      },
    },
    401: commonErrorCodes[401],
    413: {
      description:
        "Payload Too Large - File or field size/count limit exceeded.",
      type: "object",
      properties: {
        error: { type: "string" },
        details: { type: "string", nullable: true },
      },
    },
    500: commonErrorCodes[500],
  },
};
