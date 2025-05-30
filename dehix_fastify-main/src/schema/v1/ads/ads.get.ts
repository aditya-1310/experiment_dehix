import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";

export const getAdsSchema: FastifySchema = {
  description: "API to get a Ads by ID",
  summary: "API to get a Ads by ID",
  tags: ["Ads"],
  response: {
    // TODO: Add 200 response schema
    200: {
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            _id: { type: "string" },
            heading: { type: "string" },
            description: { type: "string" },
            type: { type: "string" },
            status: { type: "string" },
            background_img: { type: "string" },
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
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const getAllAdsSchema: FastifySchema = {
  description: "API to get all Ads",
  tags: ["Ads"],
  summary: "API to get all Ads",
  querystring: {
    type: "object",
    properties: {
      filters: {
        type: "string",
      },
      limit: {
        type: "string",
      },
      page: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              heading: { type: "string" },
              description: { type: "string" },
              type: { type: "string" },
              status: { type: "string" },
              background_img: { type: "string" },
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
            },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};
