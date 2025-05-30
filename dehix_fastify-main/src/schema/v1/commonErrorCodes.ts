export const commonErrorResponses = {
  401: {
    description: "Unauthorized",
    type: "object",
    properties: {
      message: { type: "string" },
      code: { type: "string" },
    },
  },
  403: {
    description: "Forbidden",
    type: "object",
    properties: {
      message: { type: "string" },
      code: { type: "string" },
    },
  },
  404: {
    description: "Not Found",
    type: "object",
    properties: {
      message: { type: "string" },
      code: { type: "string" },
    },
  },
  500: {
    description: "Internal Server Error",
    type: "object",
    properties: {
      message: { type: "string" },
    },
  },
};
