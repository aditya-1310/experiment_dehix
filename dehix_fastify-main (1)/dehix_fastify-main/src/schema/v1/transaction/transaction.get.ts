import { FastifySchema } from "fastify";

export const getAllTransactionSchema: FastifySchema = {
  description: "API to get all Transaction",
  tags: ["Transaction"],
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
              from: { type: "string" },
              to: { type: "string" },
              amount: { type: "number" },
              type: { type: "string" },
              reference: { type: "string" },
              from_type: { type: "string" },
              reference_id: { type: "string" },
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

export const getTransactionSchema: FastifySchema = {
  description: "API to get Transaction by ID",
  tags: ["Transaction"],
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: {
          properties: {
            _id: { type: "string" },
            from: { type: "string" },
            to: { type: "string" },
            amount: { type: "number" },
            type: { type: "string" },
            reference: { type: "string" },
            from_type: { type: "string" },
            reference_id: { type: "string" },
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
export const getTransactionByTypeSchema: FastifySchema = {
  description: "API to get transaction by Type",
  tags: ["Transaction"],
  querystring: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["payment", "referral", "rewards", "system generated"],
        description: "Filter transaction request by type",
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

export const getTransactionByFromTypeSchema: FastifySchema = {
  description: "API to get transaction by From_Type",
  tags: ["Transaction"],
  querystring: {
    type: "object",
    properties: {
      from_type: {
        type: "string",
        enum: ["system", "freelancer", "business", "admin"],
        description: "Filter transaction request by from_type",
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

export const getTransactionByFromSchema: FastifySchema = {
  description: "API to get Transaction by From",
  tags: ["Transaction"],
  querystring: {
    type: "object",
    properties: {
      from: {
        type: "string",
        description: "Filter transaction request by from",
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

export const getTransactionByToSchema: FastifySchema = {
  description: "API to get Transaction by To",
  tags: ["Transaction"],
  querystring: {
    type: "object",
    properties: {
      to: {
        type: "string",
        description: "Filter transaction request by To",
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

export const getTransactionByReferenceIdSchema: FastifySchema = {
  description: "API to get Transaction by reference id",
  tags: ["Transaction"],
  querystring: {
    type: "object",
    properties: {
      reference_id: {
        type: "string",
        description: "Filter transaction request by reference id",
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
