import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";
import { AdsStatusEnum, AdsTypeEnum } from "../../../models/ads.entity";

export const updateAdsSchema: FastifySchema = {
  description: "API for updating a Ads by ID",
  summary: "API for updating a Ads by ID",
  tags: ["Ads"],
  params: {
    type: "object",
    properties: {
      ads_id: { type: "string" },
    },
    required: ["Ads_id"],
  },
  body: {
    type: "object",
    properties: {
      heading: { type: "string" },
      description: { type: "string" },
      type: {
        type: "string",
        enum: Object.values(AdsTypeEnum),
      },
      status: {
        type: "string",
        enum: Object.values(AdsStatusEnum),
      },
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
    required: [],
  },
  response: {
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
