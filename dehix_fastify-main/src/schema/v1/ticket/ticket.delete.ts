import { FastifySchema } from "fastify";

export const deleteTicketSchema: FastifySchema = {
  description: "API to delete ticket data",
  tags: ["Ticket"],
  params: {
    type: "object",
    properties: {
      ticket_id: {
        type: "string",
        description: "The ID of the ticket",
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
    404: {
      type: "object",
      properties: {
        message: { type: "string" },
        code: { type: "string" },
      },
    },
    403: {
      type: "object",
      properties: {
        code: { type: "string" },
        message: { type: "string" },
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
