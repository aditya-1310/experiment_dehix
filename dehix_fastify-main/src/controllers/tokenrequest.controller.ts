import { FastifyRequest, FastifyReply } from "fastify";
import { Controller, DELETE, GET, Inject, POST, PUT } from "fastify-decorators";
import {
  STATUS_CODES,
  ERROR_CODES,
  RESPONSE_MESSAGE,
} from "../common/constants";
import { AuthController } from "../common/auth.controller";
import { createTokenRequestSchema } from "../schema/v1/tokenrequest/tokenrequest.create";
import {
  CREATE_TOKEN_REQUEST,
  DELETE_TOKEN_REQUEST_BY_ID,
  GET_ALL_TOKEN_REQUEST,
  GET_TOKEN_REQUEST_BY_ID,
  GET_TOKEN_REQUEST_BY_USER_ID,
  TOKEN_REQUEST_ENDPOINT,
  UPDATE_STATUS_BY_TOKEN_REQUEST_ID,
  UPDATE_TOKEN_REQUEST_BY_ID_,
} from "../constants/tokenrequest.constant";
import { CreateTokenRequestBody } from "../types/v1/tokenrequest/createTokenRequest";
import {
  getAllTokenRequestSchema,
  getTokenRequestByIdSchema,
  getTokenRequestByUserIdSchema,
} from "../schema/v1/tokenrequest/tokenrequest.get";
import {
  GetAllTokenRequestsQueryString,
  GetTokenRequestByUserIdPathParams,
  GetTokenRequestByUserIdQueryString,
  GetTokenRequestPathParams,
} from "../types/v1/tokenrequest/getTokenRequest";
import {
  updateTokenRequestSchema,
  updateTokenRequestStatusSchema,
} from "../schema/v1/tokenrequest/tokenrequest.update";
import {
  UpdateTokenRequestBody,
  UpdateTokenRequestStatusBody,
} from "../types/v1/tokenrequest/updateTokenRequest";
import { deleteTokenRequestSchema } from "../schema/v1/tokenrequest/tokenrequest.delete";
import { TokenRequestService } from "../services/tokenrequest.service";

@Controller({ route: TOKEN_REQUEST_ENDPOINT })
export default class TokenRequestController extends AuthController {
  @Inject(TokenRequestService)
  tokenRequestService!: TokenRequestService;

  @POST(CREATE_TOKEN_REQUEST, { schema: createTokenRequestSchema })
  async createTokenRequest(
    request: FastifyRequest<{ Body: CreateTokenRequestBody }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `TokenRequestController  -> createTokenRequest -> create Token Request}`,
      );
      const data = await this.tokenRequestService.createTokenRequest(
        request.body,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in createTokenRequest: ${error.message}`);
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  @GET(GET_ALL_TOKEN_REQUEST, { schema: getAllTokenRequestSchema })
  async getAllTokenRequest(
    request: FastifyRequest<{ Querystring: GetAllTokenRequestsQueryString }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `TokenRequestController -> getAllTokenRequest -> Fetching Token Rquests`,
      );

      const { limit, page } = request.query;

      const data = await this.tokenRequestService.getAllTokenRequest(
        page,
        limit,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getAllTokenRequest: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Ticket not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Ticket"),
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
  @PUT(UPDATE_TOKEN_REQUEST_BY_ID_, { schema: updateTokenRequestSchema })
  async updateTokenRequestById(
    request: FastifyRequest<{
      Params: GetTokenRequestPathParams;
      Body: UpdateTokenRequestBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `TokenRequestController -> updateTokenRequestById -> Updating Token Request using: ${request.params.tokenrequest_id}`,
      );

      const data = await this.tokenRequestService.updateTokenRequestById(
        request.params.tokenrequest_id,
        request.body,
      );

      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("TokenRequest"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in updateTokenRequestById: ${error.message}`);
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
  @PUT(UPDATE_STATUS_BY_TOKEN_REQUEST_ID, {
    schema: updateTokenRequestStatusSchema,
  })
  async updateTokenRequestStatusById(
    request: FastifyRequest<{
      Params: GetTokenRequestPathParams;
      Body: UpdateTokenRequestStatusBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `TokenRequestController -> updateTokenRequestStatusById -> Updating TokenRequest with ID: ${request.params.tokenrequest_id}`,
      );

      const data = await this.tokenRequestService.updateTokenRequestStatus(
        request.params.tokenrequest_id,
        request.body.status,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(
        `Error in updateTokenRequestStatusById: ${error.message}`,
      );

      if (
        error.ERROR_CODES === "TokenRequest_NOT_FOUND" ||
        error.message.includes(
          "TokenRequest with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("TokenRequest"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.ERROR_CODES === "TokenRequest_NOT_FOUND" ||
        error.message.includes("TokenRequest not found by id")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("TokenRequest"),
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

  @GET(GET_TOKEN_REQUEST_BY_ID, { schema: getTokenRequestByIdSchema })
  async getTokenRequestById(
    request: FastifyRequest<{ Params: GetTokenRequestPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `TokenRequestController -> getTokenRequestById -> Fetching TokenRequest using: ${request.params.tokenrequest_id}`,
      );

      const data = await this.tokenRequestService.getTokenRequestById(
        request.params.tokenrequest_id,
      );

      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("TokenRequest"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getTokenRequestById: ${error.message}`);
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

  @GET(GET_TOKEN_REQUEST_BY_USER_ID, { schema: getTokenRequestByUserIdSchema })
  async getTokenRequestByUserId(
    request: FastifyRequest<{
      Params: GetTokenRequestByUserIdPathParams;
      Querystring: GetTokenRequestByUserIdQueryString;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `TokenRequestController -> getTokenRequestByUserId -> Fetching TokenRequest using: ${request.params.user_id}`,
      );

      const { latestConnects = false } = request.query as {
        latestConnects: boolean;
      };
      const data = await this.tokenRequestService.getTokenRequestsByUserId(
        request.params.user_id,
        latestConnects,
      );

      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("TokenRequest"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getTokenRequestById: ${error.message}`);
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

  @DELETE(DELETE_TOKEN_REQUEST_BY_ID, { schema: deleteTokenRequestSchema })
  async deleteTokenRequestById(
    request: FastifyRequest<{ Params: GetTokenRequestPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `TokenRequestController -> deleteTokenRequestById -> Deleting TokenRequest using: ${request.params.tokenrequest_id}`,
      );
      await this.tokenRequestService.deleteTokenRequestById(
        request.params.tokenrequest_id,
      );

      reply
        .status(STATUS_CODES.SUCCESS)
        .send({ message: "Token Request deleted" });
    } catch (error: any) {
      this.logger.error(`Error in delete Token Request: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Data not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Token Request"),
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
