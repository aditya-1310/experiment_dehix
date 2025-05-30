import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";
import { InterviewType, TalentType } from "../../../models/interview.entity";

export const createInterviewSchema: FastifySchema = {
  description: "API to create interview",
  tags: ["Interview"],
  params: {
    type: "object",
    required: ["creator_id"],
    properties: {
      creator_id: {
        type: "string",
      },
    },
  },
  body: {
    type: "object",
    required: [
      // "interviewerId",
      "intervieweeId",
      "interviewType",
      "talentType",
      "talentId",
      "interviewDate",
      // "interviewBids",
    ],
    properties: {
      interviewerId: {
        type: "string",
      },
      intervieweeId: {
        type: "string",
      },
      interviewType: {
        type: "string",
        enum: Object.values(InterviewType),
      },
      talentType: {
        type: "string",
        enum: Object.values(TalentType),
      },
      talentId: {
        type: "string",
      },
      interviewDate: {
        type: "string",
        format: "date-time",
      },
      description: {
        type: "string",
      },
      intervieweeDateTimeAgreement: {
        type: "boolean",
      },
      interviewBids: {
        type: "object",
        properties: {
          interviewerId: { type: "string" },
          dateTimeAgreement: { type: "boolean" },
          suggestedDateTime: {
            type: "string",
            format: "date-time",
          },
          fee: { type: "string" },
        },
        required: [
          "interviewerId",
          "dateTimeAgreement",
          "suggestedDateTime",
          "fee",
        ],
      },
      rating: {
        type: "number",
        default: 0,
      },
      comments: {
        type: "string",
      },
    },
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
            interviewerId: { type: "string" },
            intervieweeId: { type: "string" },
            creatorId: { type: "string" },
            interviewType: {
              type: "string",
              enum: Object.values(InterviewType),
            },
            talentType: {
              type: "string",
              enum: Object.values(TalentType),
            },
            talentId: { type: "string" },
            interviewDate: { type: "string", format: "date-time" },
            description: { type: "string" },
            intervieweeDateTimeAgreement: { type: "boolean" },
            interviewBids: {
              type: "object",
              properties: {
                _id: { type: "string" },
                interviewerId: { type: "string" },
                dateTimeAgreement: { type: "boolean" },
                suggestedDateTime: { type: "string", format: "date-time" },
                fee: { type: "string" },
              },
              required: [
                "_id",
                "interviewerId",
                "dateTimeAgreement",
                "suggestedDateTime",
                "fee",
              ],
            },
            rating: { type: "number" },
            comments: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const createInterviewBidsSchema: FastifySchema = {
  description: "API to create interview bid",
  tags: ["Interview"],
  params: {
    type: "object",
    properties: {
      interview_id: { type: "string" },
    },
    required: ["interview_id"],
  },
  body: {
    type: "object",
    properties: {
      interviewerId: { type: "string" },
      dateTimeAgreement: { type: "boolean" },
      suggestedDateTime: { type: "string", format: "date-time" },
      fee: { type: "string" },
    },
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
            interviewerId: { type: "string" },
            dateTimeAgreement: { type: "boolean" },
            suggestedDateTime: { type: "string", format: "date-time" },
            fee: { type: "string" },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const selectInterviewBidSchema: FastifySchema = {
  description: "API to select interview bid",
  tags: ["Interview"],
  params: {
    type: "object",
    properties: {
      interview_id: {
        type: "string",
        description: "The ID of the interview",
      },
      bid_id: {
        type: "string",
        description: "The ID of the interview bid to be deleted",
      },
    },
    required: ["interview_id", "bid_id"],
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        interviewerId: { type: "string" },
      },
    },
    ...commonErrorResponses,
  },
};
