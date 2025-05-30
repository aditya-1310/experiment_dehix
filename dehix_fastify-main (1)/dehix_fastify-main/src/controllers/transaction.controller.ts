import { FastifyRequest, FastifyReply } from "fastify";
import { Controller, DELETE, GET, Inject, POST, PUT } from "fastify-decorators";
import {
  STATUS_CODES,
  ERROR_CODES,
  RESPONSE_MESSAGE,
  GetFilterQueryParams,
} from "../common/constants";
import { AuthController } from "../common/auth.controller";

import {
  TRANSACTION_ENDPOINT,
  CREATE_TRANSACTION,
  GET_ALL_TRANSACTION,
  GET_TRANSACTION_BY_ID,
  DELETE_TRANSACTION_BY_ID,
  GET_TRANSACTION_BY_FROM,
  GET_TRANSACTION_BY_FROM_TYPE,
  GET_TRANSACTION_BY_REFERENCE_ID,
  GET_TRANSACTION_BY_TO,
  GET_TRANSACTION_BY_TYPE,
  UPDATE_TRANSACTION_BY_ID,
} from "../constants/transaction.constant";

import { TransactionService } from "../services/transaction.service";

import { createTransactionSchema } from "../schema/v1/transaction/transaction.create";
import { deleteTransactionSchema } from "../schema/v1/transaction/transaction.delete";

import { updateTransactionSchema } from "../schema/v1/transaction/transaction.update";
import { PutTransactionBody } from "../types/v1/transaction/updateTransaction";
import { createTransactionBody } from "../types/v1/transaction/createTransaction";
import {
  GetTransactionPathParams,
  GetTransactionByFromQueryParams,
  GetTransactionByFromTypeQueryParams,
  GetTransactionByReferenceIdQueryParams,
  GetTransactionByToQueryParams,
  GetTransactionByTypeQueryParams,
} from "../types/v1/transaction/getTransaction";
import { DeleteTransactionPathParams } from "../types/v1/transaction/deleteTransaction";
import {
  getAllTransactionSchema,
  getTransactionSchema,
  getTransactionByTypeSchema,
  getTransactionByFromTypeSchema,
  getTransactionByFromSchema,
  getTransactionByReferenceIdSchema,
  getTransactionByToSchema,
} from "../schema/v1/transaction/transaction.get";
import { UserNotificationService } from "../services";
import {
  IUserNotification,
  UserNotificationTypeEnum,
} from "../models/userNotification.entity";
import { extractFilters } from "../common/utils";

@Controller({ route: TRANSACTION_ENDPOINT })
export default class TransactionController extends AuthController {
  @Inject(TransactionService)
  transactionService!: TransactionService;

  @Inject(UserNotificationService)
  userNotificationService!: UserNotificationService;

  @POST(CREATE_TRANSACTION, { schema: createTransactionSchema })
  async createTransaction(
    request: FastifyRequest<{ Body: createTransactionBody }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `TransactionController  -> createTransaction -> create Transction}`,
      );
      const data = await this.transactionService.create(request.body);

      const Notification: IUserNotification = {
        message: "Transaction has been created.",
        type: UserNotificationTypeEnum.TRANSACTION,
        entity: "Freelaner",
        path: "",
        userId: [request.body.to],
      };
      await this.userNotificationService.createNotification(Notification);

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in CreateTransaction: ${error.message}`);
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  @GET(GET_ALL_TRANSACTION, { schema: getAllTransactionSchema })
  async getAllTransaction(
    request: FastifyRequest<{ Querystring: GetFilterQueryParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `TransactionController -> getAllTransaction -> Fetching Transaction`,
      );

      const { page, limit } = request.query;
      const filters = extractFilters(request.url);

      const data = await this.transactionService.getAllTransaction(
        filters,
        page,
        limit,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getAllTransaction: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Transaction not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Transaction"),
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

  @GET(GET_TRANSACTION_BY_ID, { schema: getTransactionSchema })
  async getTransactionById(
    request: FastifyRequest<{ Params: GetTransactionPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `TransactionController -> getTransactionById -> Fetching transaction using: ${request.params.transaction_id}`,
      );

      const data = await this.transactionService.getTransactionById(
        request.params.transaction_id,
      );

      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Transaction"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getTransactionById: ${error.message}`);
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

  @DELETE(DELETE_TRANSACTION_BY_ID, { schema: deleteTransactionSchema })
  async deleteTransactionById(
    request: FastifyRequest<{ Params: DeleteTransactionPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `TransactionController -> deleteTransactionById -> Deleting transaction using: ${request.params.transaction_id}`,
      );
      await this.transactionService.deleteTransactionById(
        request.params.transaction_id,
      );

      const Notification: IUserNotification = {
        message: "Transaction has been deleted.",
        type: UserNotificationTypeEnum.TRANSACTION,
        entity: "Freelaner",
        path: "",
        userId: [request.params.transaction_id],
      };
      await this.userNotificationService.createNotification(Notification);

      reply
        .status(STATUS_CODES.SUCCESS)
        .send({ message: "Transaction deleted" });
    } catch (error: any) {
      this.logger.error(`Error in delete transaction: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Data not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Transaction"),
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

  @GET(GET_TRANSACTION_BY_TYPE, { schema: getTransactionByTypeSchema })
  async getTransactionByType(
    request: FastifyRequest<{
      Querystring: GetTransactionByTypeQueryParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `TransactionController -> getTransactionByCustomerType -> Fetching Transaction`,
      );
      const { type } = request.query;

      const data = await this.transactionService.getTransactionByType(type);
      if (data.length === 0) {
        return reply
          .code(404)
          .send({ message: "No transaction found for this type" });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getTransactionByType: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Transaction not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("transaction"),
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
  @PUT(UPDATE_TRANSACTION_BY_ID, { schema: updateTransactionSchema })
  async updateTransactionById(
    request: FastifyRequest<{
      Params: GetTransactionPathParams;
      Body: PutTransactionBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `TransactionController -> updateTransactionById -> Updating transaction using: ${request.params.transaction_id}`,
      );

      const data = await this.transactionService.updateTransactionById(
        request.params.transaction_id,
        request.body,
      );

      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Transaction"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      const Notification: IUserNotification = {
        message: "Transaction has been updated.",
        type: UserNotificationTypeEnum.TRANSACTION,
        entity: "Freelaner",
        path: "",
        userId: [request.params.transaction_id],
      };
      await this.userNotificationService.createNotification(Notification);

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in updateTransactionById: ${error.message}`);
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
  @GET(GET_TRANSACTION_BY_FROM_TYPE, { schema: getTransactionByFromTypeSchema })
  async getTransactionByFromType(
    request: FastifyRequest<{
      Querystring: GetTransactionByFromTypeQueryParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `TransactionController -> getTransactionByCustomerType -> Fetching Transaction`,
      );
      const { from_type } = request.query;

      const data =
        await this.transactionService.getTransactionByFromType(from_type);
      if (data.length === 0) {
        return reply
          .code(404)
          .send({ message: "No transaction found for this from type" });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getTransactionByFromType: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Transaction not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("transaction"),
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
  @GET(GET_TRANSACTION_BY_FROM, { schema: getTransactionByFromSchema })
  async getTransactionByFrom(
    request: FastifyRequest<{
      Querystring: GetTransactionByFromQueryParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `TransactionController -> getTransactionByFrom -> Fetching Transaction`,
      );
      const { from } = request.query;

      const data = await this.transactionService.getTransactionByFrom(from);
      if (data.length === 0) {
        return reply
          .code(404)
          .send({ message: "No transaction found for this type" });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getTransactionByType: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Transaction not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("transaction"),
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

  @GET(GET_TRANSACTION_BY_TO, { schema: getTransactionByToSchema })
  async getTransactionByTo(
    request: FastifyRequest<{
      Querystring: GetTransactionByToQueryParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `TransactionController -> getTransactionByTo -> Fetching Transaction`,
      );
      const { to } = request.query;

      const data = await this.transactionService.getTransactionByTo(to);
      if (data.length === 0) {
        return reply
          .code(404)
          .send({ message: "No transaction found for this type" });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getTransactionByTo: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Transaction not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("transaction"),
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
  @GET(GET_TRANSACTION_BY_REFERENCE_ID, {
    schema: getTransactionByReferenceIdSchema,
  })
  async getTransactionByReferenceId(
    request: FastifyRequest<{
      Querystring: GetTransactionByReferenceIdQueryParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `TransactionController -> getTransactionByReferenceId -> Fetching Transaction`,
      );
      const { reference_id } = request.query;

      const data =
        await this.transactionService.getTransactionByReferenceId(reference_id);
      if (data.length === 0) {
        return reply
          .code(404)
          .send({ message: "No transaction found for this reference id" });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(
        `Error in getTransactionByReferenceId: ${error.message}`,
      );
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Transaction not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("transaction"),
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
