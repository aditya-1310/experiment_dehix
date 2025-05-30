import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";
import { FaqTypeEnum, StatusEnum } from "../../../models/faq.entity";

export const createFaqSchema: FastifySchema = {
  description: "API to create a Faq",
  summary: "API to create a Faq",
  tags: ["Faq"],
  body: {
    type: "object",
    properties: {
      question: { type: "string" },
      answer: { type: "string" },
      type: {
        type: "string",
        enum: Object.values(FaqTypeEnum),
      },
      status: {
        type: "string",
        enum: Object.values(StatusEnum),
      },
      importantUrl: {
        type: "array",
        items: {
          type: "object",
          properties: {
            urlName: { type: "string" },
            url: { type: "string" },
          },
        },
      },
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
    required: ["question", "answer", "type", "status", "importantUrl"],
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            _id: { type: "string" },
            question: { type: "string" },
            answer: { type: "string" },
            type: { type: "string" },
            status: { type: "string" },
            importantUrl: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  urlName: { type: "string" },
                  url: { type: "string" },
                },
              },
            },
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
    ...commonErrorResponses,
  },
};

export const TicketToFaqSchema: FastifySchema = {
  description: "API for converting Token Request to FAQ",
  tags: ["Ticket"],
  params: {
    type: "object",
    properties: {
      ticket_id: { type: "string" },
    },
    required: ["ticket_id"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            _id: { type: "string" },
            question: { type: "string" },
            answer: { type: "string" },
            type: { type: "string" },
            status: { type: "string" },
            importantUrl: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  urlName: { type: "string" },
                  url: { type: "string" },
                },
              },
            },
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
    ...commonErrorResponses,
  },
};
