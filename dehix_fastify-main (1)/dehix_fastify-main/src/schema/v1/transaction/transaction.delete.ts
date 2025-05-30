import { FastifySchema } from "fastify";

export const deleteTransactionSchema: FastifySchema = {
  description: "API to delete transaction data",
  tags: ["Transaction"],
  params: {
    type: "object",
    properties: {
      transaction_id: {
        type: "string",
        description: "The ID of the transaction",
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
