import { FastifyRequest, FastifyReply } from "fastify";
import { Controller, GET, Inject, PATCH } from "fastify-decorators";
import { getBusinessDetailsPublicSchema } from "../schema/v1/business/business.get";
import { getFreelancerPublicDetails } from "../schema/v1/freelancer/freelancer.get";
import {
  ERROR_CODES,
  RESPONSE_MESSAGE,
  STATUS_CODES,
} from "../common/constants";
import { GetBusinessPathParams } from "../types/v1/business/postBusiness";
import { GetFreelancerPathParams } from "../types/v1/freelancer/getProfile";
import { BusinessService, FreelancerService } from "../services";
import {
  PUBLIC_END_POINT,
  BUSINESS_PUBLIC_PAGE_BY_ID,
  FREELANCER_PUBLIC_PAGE_BY_ID,
  GET_USER_BY_ID,
  GET_USER_BY_USERNAME,
  GET_USER_BY_EMAIL,
  CHECK_DUPLICATE_USERNAME,
  REQUEST_CONNECTS,
} from "../constants/public.constant";
import { BaseController } from "../common/base.controller";
import {
  checkDuplicateUserName,
  getUserByEmail,
  getUserById,
  getUserByUserName,
} from "../schema/v1/public/public.get";
import {
  getUserQuery,
  getUserNameQuery,
  getUserEmailQuery,
  checkDuplicateUserNameQueryString,
} from "../types/v1/public/getPublic";
import { PublicService } from "../services/public.service";
import { patchRequestConnects } from "../schema/v1/public/public.patch";
import { PatchUserConnect } from "../types/v1/public/patchPublic";

@Controller({ route: PUBLIC_END_POINT })
export default class PublicController extends BaseController {
  @Inject(BusinessService)
  BusinessService!: BusinessService;

  @Inject(FreelancerService)
  freelancerService!: FreelancerService;

  @Inject(PublicService)
  PublicService!: PublicService;

  @GET(BUSINESS_PUBLIC_PAGE_BY_ID, { schema: getBusinessDetailsPublicSchema })
  async getBusinessdetails(
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
  @GET(FREELANCER_PUBLIC_PAGE_BY_ID, { schema: getFreelancerPublicDetails })
  async getFreelancerDetails(
    request: FastifyRequest<{ Params: GetFreelancerPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> getFreelancerDetails -> Fetching freelancer details for ID: ${request.params.freelancer_id}`,
      );

      const data = await this.freelancerService.getFreelancerProfileById(
        request.params.freelancer_id,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ ...data._doc });
    } catch (error: any) {
      this.logger.error(`Error in getFreelancer: ${error.message}`);
      if (
        error.ERROR_CODES === "FREELANCER_NOT_FOUND" ||
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
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

  @GET(GET_USER_BY_EMAIL, { schema: getUserByEmail })
  async getUserByEmail(
    request: FastifyRequest<{ Querystring: getUserEmailQuery }>,
    reply: FastifyReply,
  ) {
    try {
      const { user } = request.query;

      if (!user) {
        throw new Error("user_email is required");
      }

      this.logger.info(
        `PublicController -> getUserById -> Fetching data for users: ${user}`,
      );

      const data = await this.PublicService.getUserByEmail(user);
      console.log(data);
      reply.status(STATUS_CODES.SUCCESS).send(data);
    } catch (error: any) {
      this.logger.error(`Error in getUserById: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Data not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.DATA_NOT_FOUND,
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

  @GET(GET_USER_BY_ID, { schema: getUserById })
  async getUserById(
    request: FastifyRequest<{ Querystring: getUserQuery }>,
    reply: FastifyReply,
  ) {
    try {
      let { user_ids } = request.query;

      if (!user_ids) {
        throw new Error("user_ids is required");
      }
      if (Array.isArray(user_ids)) {
        user_ids = user_ids[0];
      }
      const users = JSON.parse(user_ids);

      if (!Array.isArray(users)) {
        throw new Error("user_ids must be a valid JSON array");
      }

      this.logger.info(
        `PublicController -> getUserById -> Fetching data for users: ${users}`,
      );

      const data = await this.PublicService.getUserbyUserId(users);

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getUserById: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Data not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.DATA_NOT_FOUND,
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
  @GET(GET_USER_BY_USERNAME, { schema: getUserByUserName })
  async getUserByUserName(
    request: FastifyRequest<{ Querystring: getUserNameQuery }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `PublicController -> getUserByUserName -> Fetching User`,
      );
      let { username } = request.query;

      if (Array.isArray(username)) {
        username = username[0];
      }
      const users = JSON.parse(username);

      const data = await this.PublicService.getUserByUserName(users);
      if (!data || data.length === 0) {
        return reply
          .code(404)
          .send({ message: "No user found for this user name" });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in get user by user name: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("User not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("User"),
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

  @GET(CHECK_DUPLICATE_USERNAME, { schema: checkDuplicateUserName })
  async checkDuplicateUserName(
    request: FastifyRequest<{ Querystring: checkDuplicateUserNameQueryString }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `PublicController -> getUserByUserName -> Fetching User`,
      );
      const {
        username,
        is_freelancer = null,
        is_business = null,
      } = request.query as {
        username: string;
        is_freelancer: boolean;
        is_business: boolean;
      };

      if (!is_business && !is_freelancer) {
        return reply.status(400).send({
          message: RESPONSE_MESSAGE.BAD_REQUEST,
          code: ERROR_CODES.BAD_REQUEST_ERROR,
        });
      }

      const duplicate = await this.PublicService.checkDuplicateUserName(
        username,
        is_freelancer,
        is_business,
      );
      return reply.status(STATUS_CODES.SUCCESS).send({ duplicate });
    } catch (error: any) {
      this.logger.error(`Error in check duplicate username: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("User not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("User"),
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

  @PATCH(REQUEST_CONNECTS, { schema: patchRequestConnects })
  async RequestConnects(
    request: FastifyRequest<{ Querystring: PatchUserConnect }>,
    reply: FastifyReply,
  ) {
    try {
      const { isFreelancer, isBusiness, userId } = request.query;

      await this.PublicService.patchUserConnects(
        userId,
        isFreelancer,
        isBusiness,
      );
      return reply.status(STATUS_CODES.SUCCESS).send({
        message: "Connects updated successfully!",
      });
    } catch (error: any) {
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("User not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("User"),
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
}
