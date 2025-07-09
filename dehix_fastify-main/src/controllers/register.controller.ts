/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyRequest, FastifyReply } from "fastify";
import { Controller, Inject, POST } from "fastify-decorators";
import { FreelancerService } from "../services";
import {
  STATUS_CODES,
  ERROR_CODES,
  RESPONSE_MESSAGE,
} from "../common/constants";
import {
  REGISTRATION_ENDPOINT,
  FREELANCER_ENDPOINT,
} from "../constants/freelancer.constant";
import { IFreelancer } from "../models/freelancer.entity";
import { createFreelancerSchema } from "../schema/v1/freelancer/freelancer.create";
import { BaseController } from "../common/base.controller";
import { BUSINESS_END_POINT } from "../constants/business.constant";
import { createBusinessSchema } from "../schema/v1/business/business.create";
import { IBusiness } from "../models/business.entity";
import { BusinessService } from "../services/business.service";
import { handleFileUpload } from "../common/services/s3.service";
@Controller({ route: REGISTRATION_ENDPOINT })
export default class RegisterController extends BaseController {
  @Inject(FreelancerService)
  freelancerService!: FreelancerService;

  @Inject(BusinessService)
  businessService!: BusinessService;

  @POST(FREELANCER_ENDPOINT, { schema: createFreelancerSchema })
  async create(
    request: FastifyRequest<{
      Body: IFreelancer;
      Querystring: { referralCode?: string };
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> create -> : Creating a new freelancer`,
      );

      const referralCode: string | null = request.query.referralCode || null;
      // Validate referral code format
      if (referralCode && !referralCode.match(/^[A-Z0-9]{9}$/)) {
        return reply.status(STATUS_CODES.BAD_REQUEST).send({
          message: "Invalid referral code format",
          code: ERROR_CODES.BAD_REQUEST_ERROR,
        });
      }

      const data = await this.freelancerService.createFreelancerProfile(
        request.body,
        referralCode,
      );
      this.logger.warn(data);
      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(
        "error in controller create business profile",
        error.message,
      );
      if (error.message === RESPONSE_MESSAGE.USER_EXISTS) {
        return reply.status(STATUS_CODES.BAD_REQUEST).send({
          message: RESPONSE_MESSAGE.USER_EXISTS,
          code: ERROR_CODES.BAD_REQUEST_ERROR,
        });
      }

      // If the error is related to the referral code being invalid, return 400
      if (error.message.includes("Invalid referral code.")) {
        return reply.status(STATUS_CODES.BAD_REQUEST).send({
          message: "Invalid referral code.",
          code: ERROR_CODES.BAD_REQUEST_ERROR,
        });
      }

      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  @POST(BUSINESS_END_POINT, { schema: createBusinessSchema })
  async createBusinessProfile(
    request: FastifyRequest<{
      Body: IBusiness;
      Querystring: { referralCode?: string };
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info("BusinessController -> create business profile");

      const referralCode: string | null = request.query.referralCode || null;
      // Validate referral code format
      if (referralCode && !referralCode.match(/^[A-Z0-9]{9}$/)) {
        return reply.status(STATUS_CODES.BAD_REQUEST).send({
          message: "Invalid referral code format",
          code: ERROR_CODES.BAD_REQUEST_ERROR,
        });
      }

      const data = await this.businessService.createBusiness(
        request.body,
        referralCode,
      );
      if (!data) {
        return reply.status(STATUS_CODES.NO_CONTENT).send({
          message: RESPONSE_MESSAGE.REQUEST_DATA_INVALID,
          code: ERROR_CODES.INVALID_DATA,
        });
      }
      return reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(
        "error in controller create business profile",
        error.message,
      );
      if (error.message === RESPONSE_MESSAGE.USER_EXISTS) {
        return reply.status(STATUS_CODES.BAD_REQUEST).send({
          message: RESPONSE_MESSAGE.USER_EXISTS,
          code: ERROR_CODES.BAD_REQUEST_ERROR,
        });
      }

      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  // New API to handle image upload to S3
  @POST("/upload-image")
  async uploadImage(request: FastifyRequest, reply: FastifyReply) {
    try {
      this.logger.info("Received request to /upload-image");

      let parts;
      try {
        this.logger.info("Attempting to get file parts using request.file()");
        parts = await request.file();
        this.logger.info("Successfully got file parts. Processing file.");

        if (parts) {
          this.logger.info(
            `Parts received: fieldname='${parts.fieldname}', filename='${parts.filename}', mimetype='${parts.mimetype}'`,
          );
        } else {
          this.logger.warn(
            "request.file() returned no parts (it was null or undefined).",
          );
          return reply.status(STATUS_CODES.BAD_REQUEST).send({
            message: "No file uploaded or multipart parsing issue",
            code: ERROR_CODES.BAD_REQUEST_ERROR,
          });
        }
      } catch (err: any) {
        this.logger.error("Error during request.file() execution:", {
          error: err.message,
          stack: err.stack,
          timestamp: new Date().toISOString(),
        });
        return reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: "Error processing file stream",
          code: ERROR_CODES.SERVER_ERROR,
          errorDetail: err.message,
        });
      }

      const { file, filename, encoding, mimetype } = parts;
      this.logger.info(
        `Extracted file info: filename='${filename}', encoding='${encoding}', mimetype='${mimetype}'`,
      );

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
        "audio/mpeg",
        "audio/wav",
        "audio/ogg",
        "audio/mp4",
        "audio/webm",
        "audio/aac",
        "audio/m4a",
      ];
      if (!allowedTypes.includes(mimetype)) {
        this.logger.warn(`Invalid file type received: ${mimetype}`);
        return reply.status(STATUS_CODES.BAD_REQUEST).send({
          message:
            "Invalid file type. Allowed types: " + allowedTypes.join(", "),
          code: ERROR_CODES.BAD_REQUEST_ERROR,
        });
      }

      try {
        this.logger.info(`Starting file upload for ${filename}`);
        const uploadResult = await handleFileUpload(
          file,
          filename.replaceAll(" ", ""),
        );
        this.logger.info(
          `File upload completed successfully: ${JSON.stringify(uploadResult)}`,
        );

        return reply.status(STATUS_CODES.SUCCESS).send({
          message: "File uploaded successfully",
          data: uploadResult,
        });
      } catch (uploadError: any) {
        this.logger.error(`Error during file upload for ${filename}:`, {
          error: uploadError.message,
          stack: uploadError.stack,
          timestamp: new Date().toISOString(),
        });

        // Check for specific error types
        if (uploadError.message.includes("AWS")) {
          return reply.status(STATUS_CODES.SERVER_ERROR).send({
            message: "Error connecting to storage service. Please try again.",
            code: ERROR_CODES.SERVER_ERROR,
            errorDetail: uploadError.message,
          });
        }

        return reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: "Error uploading file. Please try again.",
          code: ERROR_CODES.SERVER_ERROR,
          errorDetail: uploadError.message,
        });
      }
    } catch (error: any) {
      this.logger.error("Unhandled error in uploadImage controller:", {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      return reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
        errorDetail: error.message,
      });
    }
  }
}
