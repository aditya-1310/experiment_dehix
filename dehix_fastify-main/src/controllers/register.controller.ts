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
      // Ensure multipart parsing is set up correctly
      const parts = await request.file(); // Use request.file() to handle single file
      if (!parts) {
        throw new Error("Multipart parsing is not set up correctly.");
      }

      // Extract file information
      const { file, filename, encoding, mimetype } = parts;
      console.log("File:", { filename, encoding, mimetype });

      // Handle file upload
      try {
        const uploadResult = await handleFileUpload(
          file,
          filename.replaceAll(" ", ""),
        ); // Your function to upload to S3
        console.log("uploaded result", uploadResult);

        // Respond once all files are processed
        return reply.status(STATUS_CODES.SUCCESS).send({
          message: "File uploaded successfully",
          data: uploadResult,
        });
      } catch (uploadError) {
        console.error("Upload error:", uploadError);
        return reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: "Error uploading file",
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    } catch (error: any) {
      this.logger.error(
        "Error in controller uploading image to S3",
        error.message,
      );
      return reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }
}
