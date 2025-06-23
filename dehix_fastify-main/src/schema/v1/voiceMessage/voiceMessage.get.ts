import { commonErrorResponses as commonErrorCodes } from "../commonErrorCodes";

export const getVoiceMessagesSchema = {
  summary: "Get voice messages for a conversation",
  description:
    "Retrieves a list of voice messages for a given conversation ID.",
  tags: ["Voice Messages"],
  querystring: {
    type: "object",
    required: ["conversationId"],
    properties: {
      conversationId: {
        type: "string",
        description: "ID of the conversation to fetch messages for.",
      },
      // Add limit, offset/cursor for pagination if needed
    },
  },
  produces: ["application/json"],
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      description: "Successfully retrieved voice messages.",
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
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
    },
    400: commonErrorCodes[400],
    401: commonErrorCodes[401],
    404: commonErrorCodes[404], // If conversation ID not found
    500: commonErrorCodes[500],
  },
};
