import { FastifySchema } from "fastify";

export const updateTicketSchema: FastifySchema = {
  description: "API for update Ticket",
  tags: ["Ticket"],
  body: {
    type: "object",
    properties: {
      customerType: { type: "string" },
      title: { type: "string" },
      description: { type: "string" },
      subject: { type: "string" },
      solution: { type: "string" },
    },
    required: [],
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            customerType: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            subject: { type: "string" },
            solution: { type: "string" },
            supportTags: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  tagId: { type: "string" },
                  tagName: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    401: {
      type: "object",
      properties: {
        message: {
          type: "string",
        },
        code: {
          type: "string",
        },
      },
    },
    403: {
      type: "object",
      properties: {
        code: {
          type: "string",
        },
        message: {
          type: "string",
        },
      },
    },
    500: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};

export const updateTicketStatusSchema = {
  description: "API to update ticket status",
  tags: ["Ticket"],
  body: {
    type: "object",
    properties: {
      status: {
        type: "string",
        enum: ["created", "closed", "active"],
        description: "The status of the Ticket",
      },
    },
    required: ["status"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
    404: {
      type: "object",
      properties: {
        message: {
          type: "string",
        },
        code: {
          type: "string",
        },
      },
    },
    403: {
      type: "object",
      properties: {
        code: {
          type: "string",
        },
        message: {
          type: "string",
        },
      },
    },
    500: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};
