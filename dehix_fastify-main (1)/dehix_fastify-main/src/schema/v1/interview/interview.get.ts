import { FastifySchema } from "fastify";
import { commonErrorResponses } from "../commonErrorCodes";
import { InterviewType, TalentType } from "../../../models/interview.entity";
import {
  FreelancerInterviewPermissionEnum,
  KycStatusEnum,
} from "../../../models/freelancer.entity";

export const getInterviewSchema: FastifySchema = {
  description: "API to get interview details",
  tags: ["Interview"],
  querystring: {
    type: "object",
    properties: {
      interviewerId: { type: "string" },
      intervieweeId: { type: "string" },
      creatorId: { type: "string" },
      page: { type: "string" },
      limit: { type: "string" },
    },
    anyOf: [
      { required: ["interviewerId"] },
      { required: ["intervieweeId"] },
      { required: ["creatorId"] },
    ],
  },
  response: {
    200: {
      description: "Success",
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            dehixTalent: {
              type: "array",
              items: {
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
                  talentId: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      label: { type: "string" },
                      type: { type: "string" },
                    },
                  },
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
                        suggestedDateTime: {
                          type: "string",
                          format: "date-time",
                        },
                        fee: { type: "string" },
                        status: { type: "string" },
                      },
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
            projects: {
              type: "array",
              items: {
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
                  talentId: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      label: { type: "string" },
                      type: { type: "string" },
                    },
                  },
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
                        suggestedDateTime: {
                          type: "string",
                          format: "date-time",
                        },
                        fee: { type: "string" },
                        status: { type: "string" },
                      },
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
        },
      },
    },
    ...commonErrorResponses,
  },
};

export const getAllInterviewSchema: FastifySchema = {
  description: "API to get all interview",
  tags: ["Interview"],
  querystring: {
    type: "object",
    properties: {
      interviewerId: { type: "string" },
      intervieweeId: { type: "string" },
      creatorId: { type: "string" },
      interviewType: { type: "string", enum: Object.values(InterviewType) },
      talentType: { type: "string", enum: Object.values(TalentType) },
      talentId: { type: "string" },
      page: { type: "string" },
      limit: { type: "string" },
    },
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
                },
              },
              rating: { type: "number" },
              comments: { type: "string" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
              transaction: {
                type: "object",
                properties: {
                  transactionId: { type: "string" },
                  status: { type: "string" },
                  fee: { type: "string" },
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

export const getAllInterviewBidsSchema: FastifySchema = {
  description: "API to get all interview bids of an interview",
  tags: ["Interview"],
  params: {
    type: "object",
    properties: {
      interview_id: {
        type: "string",
        description: "The ID of the interview",
      },
    },
    required: ["interview_id"],
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
              type: "array",
              items: {
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

export const getInterviewBidSchema: FastifySchema = {
  description: "API to get an interview bid by bid ID",
  tags: ["Interview"],
  params: {
    type: "object",
    properties: {
      bid_id: { type: "string" },
    },
    required: ["bid_id"],
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

export const getIntreviewerByTalentSchema: FastifySchema = {
  description: "API to fetch all interviewers for a talent",
  tags: ["Interview"],
  params: {
    type: "object",
    properties: {
      talent_id: { type: "string" },
    },
    required: ["talent_id"],
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
              firstName: { type: "string" },
              lastName: { type: "string" },
              userName: { type: "string" },
              profilePic: { type: "string" },
              description: { type: "string" },
              professionalInfo: {
                type: "object",
                additionalProperties: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    company: { type: "string" },
                    jobTitle: { type: "string" },
                    workDescription: { type: "string" },
                    workFrom: { type: "string", format: "date-time" },
                    workTo: { type: "string", format: "date-time" },
                    githubRepoLink: { type: "string" },
                  },
                },
              },
              skills: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    name: { type: "string" },
                    level: { type: "string" },
                    experience: { type: "string" },
                    interviewPermission: {
                      type: "string",
                      enum: Object.values(FreelancerInterviewPermissionEnum),
                    },
                  },
                },
              },
              domain: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    name: { type: "string" },
                    level: { type: "string" },
                    experience: { type: "string" },
                    interviewPermission: {
                      type: "string",
                      enum: Object.values(FreelancerInterviewPermissionEnum),
                    },
                  },
                },
              },
              projectDomain: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    name: { type: "string" },
                    level: { type: "string" },
                    experience: { type: "string" },
                  },
                },
              },
              education: {
                type: "object",
                additionalProperties: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    degree: { type: "string" },
                    fieldOfStudy: { type: "string" },
                    startDate: { type: "string", format: "date-time" },
                    endDate: { type: "string", format: "date-time" },
                    grade: { type: "string" },
                  },
                },
              },
              role: { type: "string" },
              projects: {
                type: "object",
                additionalProperties: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    projectName: { type: "string" },
                    description: { type: "string" },
                    verified: { type: "boolean" },
                    githubLink: { type: "string" },
                    start: { type: "string", format: "date-time" },
                    end: { type: "string", format: "date-time" },
                    techUsed: {
                      type: "array",
                      items: { type: "string" },
                    },
                    role: { type: "string" },
                    projectType: { type: "string" },
                  },
                },
              },
              referral: {
                type: "object",
                properties: {
                  referralCode: { type: "string" },
                },
              },
              onboardingStatus: {
                type: "boolean",
              },
              kyc: {
                type: "object",
                properties: {
                  _id: { type: "string" },
                  aadharOrGovId: { type: "string" },
                  frontImageUrl: { type: "string" },
                  backImageUrl: { type: "string" },
                  liveCapture: { type: "string" },
                  status: {
                    type: "string",
                    enum: Object.values(KycStatusEnum),
                  },
                  createdAt: { type: "string", format: "date-time" },
                  updateAt: { type: "string", format: "date-time" },
                },
              },
              dehixTalent: {
                type: "object",
                additionalProperties: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    type: { type: "string" },
                    talentId: { type: "string" },
                    talentName: { type: "string" },
                    experience: { type: "string" },
                    monthlyPay: { type: "string" },
                    status: { type: "string" },
                    activeStatus: { type: "boolean" },
                    interviews: { type: "array", items: { type: "object" } },
                  },
                },
              },

              dehixInterviewer: {
                type: "object",
                additionalProperties: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    type: { type: "string" },
                    talentId: { type: "string" },
                    talentName: { type: "string" },
                    experience: { type: "string" },
                    interviewFees: { type: "string" },
                    level: { type: "string" },
                    status: { type: "string" },
                    interviews: { type: "array", items: { type: "object" } },
                    activeStatus: { type: "boolean" },
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

export const getInterviewsByInterviewerTalentSchema: FastifySchema = {
  description: "get all interviews by interviewer's talent",
  tags: ["Interview"],
  params: {
    type: "object",
    properties: {
      interviewer_id: { type: "string" },
    },
    required: ["interviewer_id"],
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
                },
              },
              rating: { type: "number" },
              comments: { type: "string" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
              transaction: {
                type: "object",
                properties: {
                  transactionId: { type: "string" },
                  status: { type: "string" },
                  fee: { type: "string" },
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
