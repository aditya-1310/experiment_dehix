import { FastifySchema } from "fastify";

export const uploadImageSchema: FastifySchema = {
  description: "API to upload a single image file to S3",
  tags: ["File Upload"],
  summary: "Upload an image file",
  consumes: ["multipart/form-data"], // Specify the request type
  body: {
    type: "object",
    properties: {
      file: {
        type: "string",
        format: "binary", // Specify that this is a binary file upload
        description: "The image file to upload",
      },
    },
    required: ["file"], // The 'file' field is required
  },
  response: {
    200: {
      description: "Successful file upload response",
      type: "object",
      properties: {
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            Location: { type: "string" },
            Key: { type: "string" },
            Bucket: { type: "string" },
          },
        },
      },
    },
    400: {
      description: "Bad request when no file is uploaded",
      type: "object",
      properties: {
        message: { type: "string" },
        code: { type: "number" },
      },
    },
    500: {
      description: "Internal server error",
      type: "object",
      properties: {
        message: { type: "string" },
        code: { type: "number" },
      },
    },
  },
};
