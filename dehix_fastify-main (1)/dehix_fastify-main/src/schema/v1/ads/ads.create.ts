/**
 * File: ads.create.ts
 * Author: Uttam Gohil
 * Date: 31-08-2024
 * Description:schema for creating ads
 */

import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";
import { AdsStatusEnum, AdsTypeEnum } from "../../../models/ads.entity";

export const createAdsSchema: FastifySchema = {
  description: "API for creating Ads",
  summary: "API for creating Ads",
  tags: ["Ads"],
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
    required: [
      "heading",
      "description",
      "type",
      "status",
      "background_img",
      "importantUrl",
    ],
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
