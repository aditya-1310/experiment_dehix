import { FastifyReply, FastifyRequest } from "fastify"; // Only once
import { Controller, GET, Inject, PATCH, POST, PUT } from "fastify-decorators"; // Only once
import { AuthController } from "../common/auth.controller"; // Only once
import {
  ERROR_CODES,
  GetFilterQueryParams,
  RESPONSE_MESSAGE,
  STATUS_CODES,
} from "../common/constants"; // Only once

import {
  ALL_BUSINESS_END_POINT,
  BUSINESS_CONVERSATION,
  BUSINESS_END_POINT,
  BUSINESS_ID_END_POINT,
  BUSINESS_UPDATE_END_POINT,
  CREATE_BUSINESS_KYC_BY_ID,
  GET_BUSINESS_DETAILS_BY_ID,
  GET_BUSINESS_KYC_BY_ID,
  UPDATE_BUSINESS_KYC_BY_ID,
  UPDATE_STATUS_OF_BUSINESS_BY_BUSINESS_ID,
} from "../constants/business.constant"; // Only once

import {
  getAllBusinessSchema,
  getBusinessDetailsSchema,
  getBusinessKycSchema,
  getBusinessSchema,
} from "../schema/v1/business/business.get"; // Only once

import {
  updateBusinessKycSchema,
  updateBusinessSchema,
  updateBusinessStatusSchema,
} from "../schema/v1/business/business.update"; // Only once

import { BusinessService } from "../services"; // Only once

import {
  PutBusinessBody,
  PutBusinessStatusBody,
} from "../types/v1/business/updateBusiness"; // Only once

import { extractFilters } from "../common/utils"; // Only once

import { addConversation } from "../dao/conversations.dao"; // Only once

import { createBusinessChatSchema } from "../schema/v1/business/business.create"; // Only once

import { PutBusinessKycBody } from "../types/v1/business/putKyc"; // Only once

import { createBusinessKycSchema } from "../schema/v1/business/business.create"; // Only once

import { PostBusinessKycBody } from "../types/v1/business/postKyc"; // Only once
import { GetBusinessPathParams } from "../types/v1/business/postBusiness";

// Define the controller with the main business endpoint
@Controller({ route: BUSINESS_END_POINT })
export default class BusinessController extends AuthController {
  // Inject BusinessService to handle business-related logic
  @Inject(BusinessService)
  BusinessService!: BusinessService;

  // Handler to get a business profile by its ID
  @GET(BUSINESS_ID_END_POINT, { schema: getBusinessSchema })
  async getBusiness(
    request: FastifyRequest<{ Params: GetBusinessPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `BusinessController -> getBusiness -> Fetching Business profile for ID: ${request.params.business_id}`,
      );

      const data = await this.BusinessService.getBusinessProfile(
        request.params.business_id,
      );

      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Business"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ ...data._doc });
    } catch (error) {
      this.logger.info(error, "error in getBusiness");
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  // Handler to update a business profile by its ID
  @PUT(BUSINESS_UPDATE_END_POINT, { schema: updateBusinessSchema })
  async updateBusinessProfile(
    request: FastifyRequest<{
      Body: PutBusinessBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `BusinessController -> updateBusiness -> updating Business profile for ID: ${request.userId}`,
      );

      const data = await this.BusinessService.updateBusiness(
        request.userId,
        request.body,
      );

      if (!data) {
        return reply.status(STATUS_CODES.BAD_REQUEST).send({
          message: RESPONSE_MESSAGE.REQUEST_DATA_INVALID,
          code: ERROR_CODES.BAD_REQUEST_ERROR,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error) {
      this.logger.info(error, "error in updateBusinessProfile");
      return reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  // Handler to get all business profiles
  @GET(ALL_BUSINESS_END_POINT, { schema: getAllBusinessSchema })
  async getAllBusinessData(
    request: FastifyRequest<{ Querystring: GetFilterQueryParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `BusinessController -> getBusinessData -> Fetching business profiles`,
      );

      const filters = extractFilters(request.url);
      const { page, limit } = request.query;

      const data = await this.BusinessService.getAllBusinessInfo(
        filters,
        page,
        limit,
      );

      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Business"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getAllBusiness: ${error.message}`);
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  @PATCH(UPDATE_STATUS_OF_BUSINESS_BY_BUSINESS_ID, {
    schema: updateBusinessStatusSchema,
  })
  async updateBusinessStatusById(
    request: FastifyRequest<{
      Body: PutBusinessStatusBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `BusinessController -> updateBusinessStatusById -> Updating status with ID: ${request.userId}`,
      );

      const data = await this.BusinessService.updateBusinessStatus(
        request.userId,
        request.body.status,
      );

      reply.status(STATUS_CODES.SUCCESS).send({
        message: "Business Status updated",
        data,
      });
    } catch (error: any) {
      this.logger.error(`Error in updateBusinessStatusById: ${error.message}`);

      if (error.message.includes("Business not found")) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Business"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @GET(GET_BUSINESS_DETAILS_BY_ID, { schema: getBusinessDetailsSchema })
  async getBusinessdetails(request: FastifyRequest, reply: FastifyReply) {
    try {
      this.logger.info(
        `BusinessController -> getBusiness -> Fetching Business profile for ID: ${request.userId}`,
      );

      const data = await this.BusinessService.getBusinessProfile(
        request.userId,
      );

      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Business"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ ...data._doc });
    } catch (error) {
      this.logger.info(error, "error in getBusiness");
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  @POST(BUSINESS_CONVERSATION, { schema: createBusinessChatSchema })
  async createBusinessConversation(
    request: FastifyRequest<{
      Body: { participants: string[]; project_name: string };
    }>,
    reply: FastifyReply,
  ) {
    const business_id = request.userId;
    const { participants, project_name } = request.body;

    if (!participants || participants.length === 0 || !project_name) {
      return reply.status(400).send({
        message: "Participants and project name are required.",
        code: ERROR_CODES.BAD_REQUEST_ERROR,
      });
    }

    try {
      this.logger.info(`Creating conversation for Business_ID: ${business_id}`);

      const business =
        await this.BusinessService.getBusinessProfile(business_id);
      if (!business) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Business"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      const conversationId = await addConversation({
        participants,
        project_name,
      });

      reply.status(STATUS_CODES.SUCCESS).send({
        message: "Conversation created successfully.",
        conversationId,
      });
    } catch (error: any) {
      this.logger.error(`Error creating conversation: ${error.message}`);
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  @GET(GET_BUSINESS_KYC_BY_ID, { schema: getBusinessKycSchema })
  async getBusinessKyc(request: FastifyRequest, reply: FastifyReply) {
    try {
      this.logger.info(
        `BusinessController -> getBusinessKyc -> Fetching Business KYC for ID: ${request.userId}`,
      );

      const data = await this.BusinessService.getBusinessProfile(
        request.userId,
      );

      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Business"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send(data.kyc);
    } catch (error) {
      this.logger.info(error, "error in getBusiness");
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  @PUT(UPDATE_BUSINESS_KYC_BY_ID, { schema: updateBusinessKycSchema })
  async updateBusinessKyc(
    request: FastifyRequest<{
      Body: PutBusinessKycBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `BusinessController -> updateBusinessKyc -> updating Business KYC for ID: ${request.userId}`,
      );

      const data = await this.BusinessService.updateKYCDetails(
        request.userId,
        request.body,
      );

      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Business"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error) {
      this.logger.info(error, "error in updateBusinessKyc");
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  @POST(CREATE_BUSINESS_KYC_BY_ID, { schema: createBusinessKycSchema })
  async createBusinessKyc(
    request: FastifyRequest<{
      Body: PostBusinessKycBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `BusinessController -> createBusinessKyc -> creating Business KYC for ID: ${request.userId}`,
      );

      const data = await this.BusinessService.createKYCDetails(
        request.userId,
        request.body,
      );

      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Business"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error) {
      this.logger.info(error, "error in createBusinessKyc");
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }
}
