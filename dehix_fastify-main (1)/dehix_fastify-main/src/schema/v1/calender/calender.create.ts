import { FastifySchema } from "fastify";

// Schema for creating a Google Calendar meeting
export const createMeetSchema = {
  tags: ["Calendar"],
  body: {
    type: "object",
    required: ["summary", "description", "start", "end", "attendees"],
    properties: {
      summary: { type: "string", minLength: 1 },
      description: { type: "string", minLength: 1 },
      start: {
        type: "object",
        required: ["dateTime", "timeZone"],
        properties: {
          dateTime: { type: "string", format: "date-time" }, // ISO 8601 datetime format
          timeZone: { type: "string", minLength: 1 },
        },
      },
      end: {
        type: "object",
        required: ["dateTime", "timeZone"],
        properties: {
          dateTime: { type: "string", format: "date-time" },
          timeZone: { type: "string", minLength: 1 },
        },
      },
      attendees: {
        type: "array",
        items: { type: "string", format: "email" },
        minItems: 1,
      },
    },
  },
  querystring: {
    type: "object",
    required: ["code"],
    properties: {
      code: { type: "string", minLength: 1 },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
        meetLink: { type: "string" },
      },
    },
    400: {
      type: "object",
      properties: {
        message: { type: "string" },
        code: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        message: { type: "string" },
        code: { type: "string" },
      },
    },
  },
};

// Schema for creating an authentication URL
export const createAuthUrlSchema: FastifySchema = {
  description:
    "This API generates an authentication URL for Google OAuth. The URL includes a redirect URI to which the user will be redirected after successful authorization.",
  summary:
    "This API generates an authentication URL for Google OAuth. The URL includes a redirect URI to which the user will be redirected after successful authorization.",
  tags: ["Calendar"],
  querystring: {
    type: "object",
    properties: {
      redirectUri: { type: "string", format: "uri" }, // URI to redirect after authorization
    },
    required: ["redirectUri"], // Make the redirectUri query parameter required
  },
  response: {
    200: {
      type: "object",
      properties: {
        url: { type: "string", format: "uri" }, // Response includes the authentication URL
      },
    },
  },
};
