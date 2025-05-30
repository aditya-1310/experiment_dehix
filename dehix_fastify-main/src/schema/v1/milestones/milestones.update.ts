import {
  MilestoneStatus,
  PaymentStatus,
} from "../../../models/milestones.entity";
import { commonErrorResponses } from "../commonErrorCodes";
import { FastifySchema } from "fastify";

export const updateMilestoneSchema: FastifySchema = {
  description: "API to update a milestone",
  summary: "Update a Milestone",
  tags: ["Milestones"],
  body: {
    type: "object",
    properties: {
      startDate: {
        type: "object",
        properties: {
          expected: {
            type: "string", // Changed to string to match the expected input
            format: "date-time",
            description: "Expected start date of the milestone",
          },
          actual: {
            type: "string",
            format: "date-time",
            nullable: true,
            description: "Actual start date of the milestone",
          },
        },
        additionalProperties: false,
      },
      endDate: {
        type: "object",
        properties: {
          expected: {
            type: "string", // Changed to string to match the expected input
            format: "date-time",
            description: "Expected end date of the milestone",
          },
          actual: {
            type: "string",
            format: "date-time",
            nullable: true,
            description: "Actual end date of the milestone",
          },
        },
        additionalProperties: false,
      },
      amount: {
        type: "number",
        nullable: true,
        description: "Amount associated with the milestone",
      },
      stories: {
        type: "array",
        description: "List of stories associated with the milestone",
        items: {
          type: "object",
          properties: {
            summary: {
              type: "string",
              description: "Brief summary of the story",
            },
            importantUrls: {
              type: "array",
              description: "List of important URLs associated with the story",
              items: {
                type: "object",
                properties: {
                  urlName: { type: "string", description: "Name of the URL" },
                  url: { type: "string", description: "URL" },
                },
                required: ["urlName", "url"], // Ensuring both urlName and url are required
              },
            },
            title: {
              type: "string",
              description: "Title of the story",
            },
            storyStatus: {
              type: "string",
              enum: Object.values(MilestoneStatus),
              description: "Status of the story",
            },
            tasks: {
              type: "array",
              description: "List of tasks associated with the story",
              items: {
                type: "object",
                properties: {
                  summary: {
                    type: "string",
                    description: "Brief summary of the task",
                  },
                  title: {
                    type: "string",
                    description: "Title of the task",
                  },
                  taskStatus: {
                    type: "string",
                    enum: Object.values(MilestoneStatus),
                    description: "Status of the task",
                  },
                  freelancers: {
                    type: "array",
                    description: "List of freelancers associated with the task",
                    items: {
                      type: "object",
                      properties: {
                        freelancerId: {
                          type: "string",
                          description: "ID of the freelancer",
                        },
                        freelancerName: {
                          type: "string",
                          description: "Name of the freelancer",
                        },
                        cost: {
                          type: "number",
                          description: "Cost for the freelancer",
                        },
                        paymentStatus: {
                          type: "string",
                          enum: Object.values(PaymentStatus),
                          description: "Payment status for the freelancer",
                        },
                        transactionId: {
                          type: "string",
                          nullable: true,
                          description: "Transaction ID",
                        },
                        startDate: {
                          type: "object",
                          properties: {
                            expected: {
                              type: "string",
                              format: "date-time",
                              description: "Expected start date of the task",
                            },
                            actual: {
                              type: "string",
                              format: "date-time",
                              nullable: true,
                              description: "Actual start date of the task",
                            },
                          },
                          additionalProperties: false,
                        },
                        endDate: {
                          type: "object",
                          properties: {
                            expected: {
                              type: "string",
                              format: "date-time",
                              description: "Expected end date of the task",
                            },
                            actual: {
                              type: "string",
                              format: "date-time",
                              nullable: true,
                              description: "Actual end date of the task",
                            },
                          },
                        },
                        updatePermissionFreelance: {
                          type: "boolean",
                          default: false,
                          description: "Update permission for freelancer",
                        },
                        updatePermissionBusiness: {
                          type: "boolean",
                          default: false,
                          description: "Update permission for business",
                        },
                        acceptanceFreelance: {
                          type: "boolean",
                          default: false,
                          description: "Acceptance by freelancer",
                        },
                        acceptanceBusiness: {
                          type: "boolean",
                          default: false,
                          description: "Acceptance by business",
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                },
                additionalProperties: false,
              },
            },
          },
          additionalProperties: false,
        },
      },
      payment: {
        type: "object",
        properties: {
          amount: {
            type: "number",
            description: "Payment amount for the milestone",
          },
          status: {
            type: "string",
            enum: Object.values(PaymentStatus),
            description: "Payment status of the milestone",
          },
        },
        additionalProperties: false,
      },
      title: {
        type: "string",
        description: "Title of the milestone",
      },
      description: {
        type: "string",
        description: "Detailed description of the milestone",
      },
      status: {
        type: "string",
        enum: Object.values(MilestoneStatus),
        description: "Current status of the milestone",
      },
    },
    additionalProperties: false,
  },
  response: {
    // 200 repsonse todo
    ...commonErrorResponses,
  },
};

export const updateTaskFreelancerSchema: FastifySchema = {
  description: "Update task and freelancers permissions",
  tags: ["Milestones"],
  params: {
    type: "object",
    properties: {
      milestoneId: { type: "string", description: "ID of the milestone" },
      storyId: { type: "string", description: "ID of the story" },
      taskId: { type: "string", description: "ID of the task" },
    },
    required: ["milestoneId", "storyId", "taskId"],
  },
  body: {
    type: "object",
    required: ["updatePermissionFreelancer", "updatePermissionBusiness"],
    properties: {
      updatePermissionFreelancer: {
        type: "boolean",
        description: "Permission for freelancers to update the task",
      },
      updatePermissionBusiness: {
        type: "boolean",
        description: "Permission for businesses to update the task",
      },
      acceptanceFreelancer: {
        type: "boolean",
        description: "Acceptance status by the freelancer",
      },
      acceptanceBusiness: {
        type: "boolean",
        description: "Acceptance status by the business",
      },
    },
  },
  response: {
    ...commonErrorResponses,
  },
};

export const updateTaskFreelancerDeatilSchema: FastifySchema = {
  description: "Update task and freelancers permissions",
  tags: ["Milestones"],
  params: {
    type: "object",
    properties: {
      milestoneId: { type: "string", description: "ID of the milestone" },
      storyId: { type: "string", description: "ID of the story" },
      taskId: { type: "string", description: "ID of the task" },
    },
    required: ["milestoneId", "storyId", "taskId"],
  },
  body: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "Permission for freelancers to update the task",
      },
      summary: {
        type: "string",
        description: "Permission for businesses to update the task",
      },
      taskStatus: {
        type: "string",
        enum: Object.values(MilestoneStatus),
        description: "Acceptance status by the freelancer",
      },
    },
  },
  response: {
    ...commonErrorResponses,
  },
};
