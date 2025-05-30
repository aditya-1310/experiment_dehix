import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const getAllFaqSchema: FastifySchema = {
  description: "API to get all Faqs",
  summary: "API to get all Faqs",
  tags: ["Faq"],
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
    },

    ...commonErrorResponses,
  },
};

export const getFaqsByTagSchema: FastifySchema = {
  description: "API to get all Faqs by support tag",
  tags: ["Faq"],
  querystring: {
    type: "object",
    properties: {
      tagNames: {
        type: "array",
        items: { type: "string" },
      },
    },
    required: ["tagNames"],
  },
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
    },
    ...commonErrorResponses,
  },
};
