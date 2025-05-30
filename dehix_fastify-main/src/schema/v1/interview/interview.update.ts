import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";
import { InterviewType, TalentType } from "../../../models/interview.entity";

export const updateInterviewSchema: FastifySchema = {
  description: "API to update interview",
  tags: ["Interview"],
  params: {
    type: "object",
    properties: {
      interview_id: {
        type: "string",
        description: "interview_id",
      },
    },
    required: ["interview_id"],
  },
  body: {
    type: "object",
    properties: {
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
        additionalProperties: {
          type: "object",
          properties: {
            _id: { type: "string" },
            interviewerId: { type: "string" },
            dateTimeAgreement: { type: "boolean" },
            suggestedDateTime: { type: "string", format: "date-time" },
            fee: { type: "string" },
            status: {
              type: "string",
              enum: ["PENDING", "ACCEPTED", "REJECTED"],
            },
          },
          required: [
            "_id",
            "interviewerId",
            "dateTimeAgreement",
            "suggestedDateTime",
            "fee",
          ],
        },
      },
      rating: {
        type: "number",
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
              additionalProperties: {
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
            },
            rating: { type: "number" },
            comments: { type: "string" },
            transaction: {
              type: "object",
              properties: {
                transactionId: { type: "string" },
                status: { type: "string" },
                fee: { type: "string" },
              },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const updateInterviewBidSchema: FastifySchema = {
  description: "API to update interview bid",
  tags: ["Interview"],
  params: {
    type: "object",
    properties: {
      interview_id: { type: "string" },
      bid_id: { type: "string" },
    },
    required: ["interview_id", "bid_id"],
  },
  body: {
    type: "object",
    properties: {
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
