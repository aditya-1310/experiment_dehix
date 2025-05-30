import { FastifySchema } from "fastify";
import { CustomerType, TicketStatus } from "../../../models/ticket.entity";

export const getAllTicketSchema: FastifySchema = {
  description: "API to get all Ticket",
  tags: ["Ticket"],
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              customerID: { type: "string" },
              customerType: { type: "string" },
              title: { type: "string" },
              description: { type: "string" },
              filesAttached: { type: "string" },
              status: { type: "string" },
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
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
        },
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

export const getTicketSchema: FastifySchema = {
  description: "API to get Ticket by ID",
  tags: ["Ticket"],
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: {
          properties: {
            _id: { type: "string" },
            customerID: { type: "string" },
            customerType: { type: "string" },
            description: { type: "string" },
            filesAttached: { type: "string" },
            status: { type: "string" },
            subject: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
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

export const getTicketsByCustomerTypeSchema: FastifySchema = {
  description: "API to get Ticket by CustomerType",
  tags: ["Ticket"],
  querystring: {
    type: "object",
    properties: {
      customerType: {
        type: "string",
        enum: Object.values(CustomerType),
        description: "Filter ticket request by customer type",
      },
    },
  },
  response: {
    404: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};

export const getTicketsByStatusSchema: FastifySchema = {
  description: "API to get Ticket by Status",
  tags: ["Ticket"],
  querystring: {
    type: "object",
    properties: {
      status: {
        type: "string",
        enum: Object.values(TicketStatus),
        description: "Filter ticket request by status",
      },
    },
  },
  response: {
    404: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};

export const getTicketsBySubjectSchema: FastifySchema = {
  description: "API to get Ticket by Subject",
  tags: ["Ticket"],
  querystring: {
    type: "object",
    properties: {
      subject: {
        type: "string",
        description: "Filter ticket request by subject",
      },
    },
  },
  response: {
    404: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};

export const getTicketsByCustomerIDSchema: FastifySchema = {
  description: "API to get Ticket by CustomerID",
  tags: ["Ticket"],
  querystring: {
    type: "object",
    properties: {
      customerID: {
        type: "string",
      },
    },
  },
  response: {
    404: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};
