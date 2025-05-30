/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyRequest, FastifyReply } from "fastify";
import { Controller, GET, Inject, PUT } from "fastify-decorators";
import {
  STATUS_CODES,
  ERROR_CODES,
  RESPONSE_MESSAGE,
} from "../common/constants";
import { AuthController } from "../common/auth.controller";
import { VerificationService } from "../services";
import {
  getVerificationDataSchema,
  getAllVerificationDataSchema,
} from "../schema/v1/verifications/verifications.get";
import {
  ORACLE_ID_ENDPOINT,
  ORACLE_UPDATE_END_POINT,
  GET_ALL_ORACLE_ENDPOINT,
  VERIFICATION_ENDPOINT,
  VERIFICATION_BY_VERIFIER_ID,
  UPDATE_COMMENT_IN_VERIFICATION,
} from "../constants/verification.constant";
import { GetVerifierPathParams } from "../types/v1/verifications/getVerificationData";
import { GetDocTypeQueryParams } from "../types/v1/verifications/getDocType";
import {
  updateVerificationStatusSchema,
  updateVerificationCommentSchema,
} from "../schema/v1/verifications/verification.patch";
import {
  PatchOracleBody,
  PutCommentBody,
} from "../types/v1/verifications/updateVerificationBody";
import { TransactionService } from "../services/transaction.service";
import { UserNotificationService } from "../services";
import {
  IUserNotification,
  UserNotificationTypeEnum,
} from "../models/userNotification.entity";

@Controller({ route: VERIFICATION_ENDPOINT })
export default class VerificationsController extends AuthController {
  @Inject(VerificationService)
  verificationService!: VerificationService;

  @Inject(TransactionService)
  transactionService!: TransactionService;

  @Inject(UserNotificationService)
  userNotificationService!: UserNotificationService;

  @GET(ORACLE_ID_ENDPOINT, { schema: getVerificationDataSchema })
  async getVerificationData(
    request: FastifyRequest<{
      Params: GetVerifierPathParams;
      Querystring: GetDocTypeQueryParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `VerificationsController -> getVerificationData -> Fetching verification request for verifier ID: ${request.params.verifier_id}`,
      );

      const { verifier_id } = request.params;
      const { doc_type = "default" } = request.query;

      // const data = await this.verificationService.getVerificationData(
      //   verifier_id,
      //   doc_type,
      // );
      const data = await this.verificationService.getVerificationData(
        verifier_id,
        doc_type as
          | "experience"
          | "domain"
          | "education"
          | "skill"
          | "business"
          | "project",
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getVerificationData: ${error.message}`);
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

  @PUT(ORACLE_UPDATE_END_POINT, { schema: updateVerificationStatusSchema })
  async updateVerificationStatus(
    request: FastifyRequest<{
      Body: PatchOracleBody;
      Params: GetVerifierPathParams;
      Querystring: GetDocTypeQueryParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `VerificationsController -> updateVerificationData -> updating verification request for verifier ID: ${request.params.verifier_id}`,
      );
      const { doc_type = "default" } = request.query;
      await this.verificationService.updateVerificationStatus(
        request.params.document_id,
        request.body.verification_status,
        request.body.comments,
        // request.query.doc_type,
        doc_type as
          | "experience"
          | "domain"
          | "education"
          | "skill"
          | "business"
          | "project",
      );
      try {
        const { doc_type } = request.query;

        let notification: IUserNotification;

        switch (doc_type) {
          case "education":
            notification = {
              message: "Education has been verified.",
              type: UserNotificationTypeEnum.VERIFICATION,
              entity: "Freelaner as Oracle",
              path: "/freelancer/oracleDashboard/educationVerification",
              userId: [request.params.verification_id],
            };
            await this.userNotificationService.createNotification(notification);
            break;
          case "project":
            notification = {
              message: "Project has been verified.",
              type: UserNotificationTypeEnum.VERIFICATION,
              entity: "Freelaner as Oracle",
              path: "/freelancer/oracleDashboard/projectVerification",
              userId: [request.params.verification_id],
            };
            await this.userNotificationService.createNotification(notification);
            break;
          case "experience":
            notification = {
              message: "Work experience has been verified.",
              type: UserNotificationTypeEnum.VERIFICATION,
              entity: "Freelaner as Oracle",
              path: "/freelancer/oracleDashboard/workExpVerification",
              userId: [request.params.verification_id],
            };
            await this.userNotificationService.createNotification(notification);
            break;
          case "business":
            notification = {
              message: "Business has been verified.",
              type: UserNotificationTypeEnum.VERIFICATION,
              entity: "Freelaner as Oracle",
              path: "/freelancer/oracleDashboard/businessVerification",
              userId: [request.params.verification_id],
            };
            await this.userNotificationService.createNotification(notification);
            break;
          default:
            this.logger.error(`Invalid document type: ${doc_type}`);
            reply
              .status(STATUS_CODES.BAD_REQUEST)
              .send({ message: "Invalid document type provided" });
            return;
        }
      } catch (error: any) {
        this.logger.error(`Error processing document: ${error.message}`);
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ message: "verification done" });
    } catch (error: any) {
      this.logger.error(`Error in updateVerificationData: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Verification not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Verification"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Verification Document not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Verification"),
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
  // GET request to fetch all verification data for oracle
  @GET(GET_ALL_ORACLE_ENDPOINT, { schema: getAllVerificationDataSchema })
  async getAllVerificationData(
    request: FastifyRequest<{
      Querystring: GetDocTypeQueryParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `AdminsController -> getAllVerificationData -> Fetching verification data`,
      );
      const { doc_type } = request.query;

      const data =
        await this.verificationService.getAllVerificationData(doc_type);

      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Verification Data"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }
      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getAllVerificationData: ${error.message}`);
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }
  @GET(VERIFICATION_BY_VERIFIER_ID, { schema: getVerificationDataSchema })
  async getVerificationByVerifierId(
    request: FastifyRequest<{
      Params: GetVerifierPathParams;
      Querystring: GetDocTypeQueryParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `VerificationsController -> getVerificationData -> Fetching verification request for verifier ID: ${request.params.verifier_id}`,
      );

      const { verifier_id } = request.params;
      // const { doc_type } = request.query;

      // const data = await this.verificationService.getVerificationByVerifierId(
      //   verifier_id,
      //   doc_type,
      // );
      const { doc_type = "default" } = request.query;

      const data = await this.verificationService.getVerificationByVerifierId(
        verifier_id,
        doc_type as
          | "experience"
          | "domain"
          | "education"
          | "skill"
          | "business"
          | "project",
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getVerificationData: ${error.message}`);
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
  @PUT(UPDATE_COMMENT_IN_VERIFICATION, {
    schema: updateVerificationCommentSchema,
  })
  async updateVerificationComment(
    request: FastifyRequest<{
      Body: PutCommentBody;
      Params: GetVerifierPathParams;
      Querystring: GetDocTypeQueryParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `VerificationsController -> updateVerificationData -> updating verification request for verifier ID: ${request.params.verification_id}`,
      );
      await this.verificationService.putCommentInVerification(
        request.params.verification_id,
        request.body.comment,
        request.body.verifiedAt,
        request.body.verification_status,
      );
      const { doc_type, verifier_id } =
        await this.verificationService.getVerificationByID(
          request.params.verification_id,
        );
      const freelancer_id = verifier_id;
      try {
        let amount = 0;
        switch (doc_type) {
          case "business":
            amount = parseInt(
              process.env.VERIFICATION_REWARD_BUSINESS || "10",
              10,
            );
            break;
          case "education":
            amount = parseInt(
              process.env.VERIFICATION_REWARD_EDUCATION || "7",
              10,
            );
            break;
          case "experience":
            amount = parseInt(
              process.env.VERIFICATION_REWARD_EXPERIENCE || "7",
              10,
            );
            break;
          case "project":
            amount = parseInt(
              process.env.VERIFICATION_REWARD_PROJECT || "5",
              10,
            );
            break;
          default:
            throw new Error("Invalid doc_type");
        }
        const transactionData = {
          from: "system",
          to: "freelancer",
          amount,
          type: "rewards",
          from_type: "admin",
          reference: "freelancer",
          reference_id: freelancer_id,
        };

        await this.transactionService.create(transactionData);
      } catch (error: any) {
        this.logger.error(
          `Error in updateVerificationComment: ${error.message}`,
        );
      }

      await this.verificationService.increaseConnects(freelancer_id, doc_type);
      reply.status(STATUS_CODES.SUCCESS).send({ message: "verification done" });
    } catch (error: any) {
      this.logger.error(`Error in updateVerificationData: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Verification not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Verification"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Verification Document not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Verification"),
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
