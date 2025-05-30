/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyRequest, FastifyReply } from "fastify";
import {
  Controller,
  GET,
  DELETE,
  POST,
  PUT,
  PATCH,
  Inject,
} from "fastify-decorators";
import {
  STATUS_CODES,
  ERROR_CODES,
  RESPONSE_MESSAGE,
} from "../common/constants";
import { AuthController } from "../common/auth.controller";
import {
  ADD_TALENT_INTO_LOBBY_ENDPOINT,
  GET_DEHIX_TALENT_IN_LOBBY_ENDPOINT,
  GET_HIRE_BY_ID_ENDPOINT,
  GET_INVITED_DEHIX_TALENT_ENDPOINT,
  GET_REJECTED_DEHIX_TALENT_ENDPOINT,
  GET_SELECTED_DEHIX_TALENT_ENDPOINT,
  HIRE_CREATE_ENDPOINT,
  HIRE_DEHIX_TALENT_UPDATE_BY_ID,
  HIRE_DELETE_BY_ID_ENDPOINT,
  HIRE_UPDATE_BY_ID_ENDPOINT,
  INVITE_DEHIX_TALENT_ENDPOINT,
  REJECT_DEHIX_TALENT_ENDPOINT,
  SELECT_DEHIX_TALENT_ENDPOINT,
  UPDATE_BOOKMARKED_BY_ID,
} from "../constants/hireDehixTalent.constant";
import { HireService } from "../services/hireDehixTalent.service";
import {
  addTalentIntoLobbySchema,
  createhireDehixTalentSchema,
} from "../schema/v1/hireDehixTalent/hireDehixTalent.create";
import { IHire } from "../models/hireDehixTalent.entity";
import {
  inviteDehixTalentSchema,
  updateBookmarkedHireDehixTalentSchema,
  UpdateHireDehixTalent,
  updateStatusHireDehixTalentSchema,
} from "../schema/v1/hireDehixTalent/hireDehixTalent.update";
import {
  PutHireDehixTalentBody,
  HireDehixTalentPathParams,
  PutStatusHireDehixTalent,
  PutHireDehixTalentBookmarkedBody,
  AddDehixTalentInInvitedBody,
} from "../types/v1/hireDehixTalent/updateHireDehixTalent";
import { deleteHireDehixTalentSchema } from "../schema/v1/hireDehixTalent/hireDehixTalent.delete";
import { BUSINESS_END_POINT } from "../constants/business.constant";
import {
  getDehixTalentInLobbySchema,
  getHireDehixTalentSchema,
  getInvitedDehixTalentSchema,
  getRejectedDehixTalentSchema,
  getSelectedDehixTalentSchema,
} from "../schema/v1/hireDehixTalent/hireDehixTalent.get";
import { AddDehixTalentInLobbyBody } from "../types/v1/hireDehixTalent/addFreelancerIntoLobby";
import { UserNotificationService } from "../services";
import {
  IUserNotification,
  UserNotificationTypeEnum,
} from "../models/userNotification.entity";

@Controller({ route: BUSINESS_END_POINT })
export default class HireController extends AuthController {
  @Inject(HireService)
  hireService!: HireService;

  @Inject(UserNotificationService)
  userNotificationService!: UserNotificationService;

  @POST(HIRE_CREATE_ENDPOINT, { schema: createhireDehixTalentSchema })
  async create(
    request: FastifyRequest<{
      Body: IHire;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `HireController -> create -> Create a new hireDehixTalent using Id: ${request.userId}`,
      );

      const data = await this.hireService.createhireDehixTalent(
        request.userId,
        request.body,
      );
      this.logger.warn(data);
      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in CreateHireDehixTalent: ${error.message}`);
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  @PUT(HIRE_UPDATE_BY_ID_ENDPOINT, { schema: UpdateHireDehixTalent })
  async putHireDehixTalent(
    request: FastifyRequest<{
      Params: HireDehixTalentPathParams;
      Body: PutHireDehixTalentBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `HireController -> putHireDehixTalent-> update hire dehix talent using ID: ${request.params.hireDehixTalent_id}`,
      );

      const data = await this.hireService.putHireDehixTalent(
        request.params.hireDehixTalent_id,
        request.body,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in experince add: ${error.message}`);
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  @DELETE(HIRE_DELETE_BY_ID_ENDPOINT, { schema: deleteHireDehixTalentSchema })
  async deleteExperienceFreelancer(
    request: FastifyRequest<{ Params: HireDehixTalentPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `HireController -> deleteHireDehixTalent -> Deleting hire dehix talent using ID: ${request.params.hireDehixTalent_id}`,
      );

      await this.hireService.deleteHireDehixTalent(
        request.params.hireDehixTalent_id,
      );

      reply
        .status(STATUS_CODES.SUCCESS)
        .send({ message: "Hire Dehix Talent deleted" });
    } catch (error: any) {
      this.logger.error(`Error in deleteHireDehixTalent: ${error.message}`);
      if (
        error.ERROR_CODES === "HIRE_DEHIX_TALENT_NOT_FOUND" ||
        error.message.includes("Hire Dehix Talent not found by id")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Hire Dehix Talent"),
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

  @GET(GET_HIRE_BY_ID_ENDPOINT, { schema: getHireDehixTalentSchema })
  async getHireDehixTalentById(request: FastifyRequest, reply: FastifyReply) {
    try {
      this.logger.info(
        `HireController -> getHireDehixTalentById -> Fetching hire dehix talent for BusinessID: ${request.userId}`,
      );

      const data = await this.hireService.getHireDehixTalentById(
        request.userId,
      );

      if (!data || data.length === 0) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Hire Dehix Talent"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getHireDehixTalentById: ${error.message}`);
      if (
        error.ERROR_CODES === "BUSINESS_NOT_FOUND" ||
        error.message.includes("Business with provided ID could not be found.")
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

  @PATCH(HIRE_DEHIX_TALENT_UPDATE_BY_ID, {
    schema: updateStatusHireDehixTalentSchema,
  })
  async updateHireDehixTalentById(
    request: FastifyRequest<{
      Params: HireDehixTalentPathParams;
      Body: PutStatusHireDehixTalent;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `HireController -> updateHireDehixTalentById -> Updating hireDehixTalent with ID: ${request.params.hireDehixTalent_id}`,
      );

      const data = await this.hireService.updateHireDehixTalent(
        request.userId,
        request.params.hireDehixTalent_id,
        request.body,
      );

      const status = request.body.status;
      if (status === "APPROVED") {
        const FreelancerNotification: IUserNotification = {
          message: "You are hired by business.",
          type: UserNotificationTypeEnum.HIRE,
          entity: "Freelaner",
          path: "/freelancer/talent",
          userId: [request.params.hireDehixTalent_id],
        };
        await this.userNotificationService.createNotification(
          FreelancerNotification,
        );

        const BusinessNotification: IUserNotification = {
          message: "Talent is hired successfully.",
          type: UserNotificationTypeEnum.HIRE,
          entity: "business",
          path: "/business/talent",
          userId: [request.userId],
        };
        await this.userNotificationService.createNotification(
          BusinessNotification,
        );
      }
      reply
        .status(STATUS_CODES.SUCCESS)
        .send({ message: "Hire Dehix Talent updated", data });
    } catch (error: any) {
      this.logger.error(`Error in updateHireDehixTalentById: ${error.message}`);
      if (
        error.ERROR_CODES === "BUSINESS_NOT_FOUND" ||
        error.message.includes("Business with provided ID could not be found.")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Business"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.ERROR_CODES === "HIRE_DEHIX_TALENT_NOT_FOUND" ||
        error.message.includes("Hire Dehix Talent not found by id")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Hire Dehix Talent"),
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

  /**
   * Adds a Dehix talent into the lobby for hire.
   *
   * This endpoint handles the addition of a Dehix talent into the lobby using
   * the provided `hireDehixTalent_id` from the request parameters and the talent
   * details from the request body.
   */
  @PUT(ADD_TALENT_INTO_LOBBY_ENDPOINT, {
    schema: addTalentIntoLobbySchema,
  })
  async addDehixTalentIntoLobby(
    request: FastifyRequest<{
      Body: AddDehixTalentInLobbyBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `HireController -> addDehixTalentIntoLobby -> adding DehixTalent into lobby with ID:  ${request.body}`,
      );

      const response = await this.hireService.addDehixTalentIntoLobby(
        request.body,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ response });
    } catch (error: any) {
      this.logger.error(`Error in addDehixTalentIntoLobby: ${error.message}`);
      if (
        error.ERROR_CODES === "HIRE_DEHIX_TALENT_NOT_FOUND" ||
        error.message.includes("Hire Dehix Talent not found by id")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Hire Dehix Talent"),
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

  @PUT(INVITE_DEHIX_TALENT_ENDPOINT, {
    schema: inviteDehixTalentSchema,
  })
  async inviteDehixTalent(
    request: FastifyRequest<{
      Params: HireDehixTalentPathParams;
      Body: AddDehixTalentInInvitedBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `HireController -> inviteDehixTalent -> invite DehixTalent with ID: ${request.params.hireDehixTalent_id} ${request.body}`,
      );

      const data = await this.hireService.inviteDehixTalent(
        request.params.hireDehixTalent_id,
        request.body,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in inviteDehixTalent: ${error.message}`);
      if (
        error.ERROR_CODES === "HIRE_DEHIX_TALENT_NOT_FOUND" ||
        error.message.includes("Hire Dehix Talent not found by id")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Hire Dehix Talent"),
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

  @PUT(SELECT_DEHIX_TALENT_ENDPOINT, {
    schema: inviteDehixTalentSchema,
  })
  async selectDehixTalent(
    request: FastifyRequest<{
      Params: HireDehixTalentPathParams;
      Body: AddDehixTalentInLobbyBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `HireController -> selectDehixTalent -> select DehixTalent with ID: ${request.params.hireDehixTalent_id} ${request.body}`,
      );

      const data = await this.hireService.selectDehixTalent(
        request.params.hireDehixTalent_id,
        request.body,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in selectDehixTalent: ${error.message}`);
      if (
        error.ERROR_CODES === "HIRE_DEHIX_TALENT_NOT_FOUND" ||
        error.message.includes("Hire Dehix Talent not found by id")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Hire Dehix Talent"),
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

  @PUT(REJECT_DEHIX_TALENT_ENDPOINT, {
    schema: inviteDehixTalentSchema,
  })
  async rejectDehixTalent(
    request: FastifyRequest<{
      Params: HireDehixTalentPathParams;
      Body: AddDehixTalentInLobbyBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `HireController -> rejectDehixTalent -> invitun DehixTalent with ID: ${request.params.hireDehixTalent_id} ${request.body}`,
      );

      const data = await this.hireService.rejectDehixTalent(
        request.params.hireDehixTalent_id,
        request.body,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in inviteDehixTalent: ${error.message}`);
      if (
        error.ERROR_CODES === "HIRE_DEHIX_TALENT_NOT_FOUND" ||
        error.message.includes("Hire Dehix Talent not found by id")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Hire Dehix Talent"),
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

  @GET(GET_DEHIX_TALENT_IN_LOBBY_ENDPOINT, {
    schema: getDehixTalentInLobbySchema,
  })
  async getDehixTalentInLobby(
    request: FastifyRequest<{
      Params: HireDehixTalentPathParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `HireController -> getDehixTalentInLobby -> get DehixTalent in lobby with ID: ${request.params.hireDehixTalent_id}`,
      );

      const data = await this.hireService.getDehixTalentInLobby(
        request.params.hireDehixTalent_id,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getInvitedDehixTalent: ${error.message}`);
      if (
        error.ERROR_CODES === "HIRE_DEHIX_TALENT_NOT_FOUND" ||
        error.message.includes("Hire Dehix Talent not found by id")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Hire Dehix Talent"),
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

  @GET(GET_INVITED_DEHIX_TALENT_ENDPOINT, {
    schema: getInvitedDehixTalentSchema,
  })
  async getInvitedDehixTalent(
    request: FastifyRequest<{
      Params: HireDehixTalentPathParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `HireController -> getInvitedDehixTalent -> get invited DehixTalent with ID: ${request.params.hireDehixTalent_id}`,
      );

      const data = await this.hireService.getInvitedDehixTalent(
        request.params.hireDehixTalent_id,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getInvitedDehixTalent: ${error.message}`);
      if (
        error.ERROR_CODES === "HIRE_DEHIX_TALENT_NOT_FOUND" ||
        error.message.includes("Hire Dehix Talent not found by id")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Hire Dehix Talent"),
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

  @GET(GET_SELECTED_DEHIX_TALENT_ENDPOINT, {
    schema: getSelectedDehixTalentSchema,
  })
  async getSelectedDehixTalent(
    request: FastifyRequest<{
      Params: HireDehixTalentPathParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `HireController -> getSelectedDehixTalent -> get Selected DehixTalent with ID: ${request.params.hireDehixTalent_id}`,
      );

      const data = await this.hireService.getSelectedDehixTalent(
        request.params.hireDehixTalent_id,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getSelectedDehixTalent: ${error.message}`);
      if (
        error.ERROR_CODES === "HIRE_DEHIX_TALENT_NOT_FOUND" ||
        error.message.includes("Hire Dehix Talent not found by id")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Hire Dehix Talent"),
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

  @GET(GET_REJECTED_DEHIX_TALENT_ENDPOINT, {
    schema: getRejectedDehixTalentSchema,
  })
  async getRejectedDehixTalent(
    request: FastifyRequest<{
      Params: HireDehixTalentPathParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `HireController -> getRejectedDehixTalent -> get Rejected DehixTalent with ID: ${request.params.hireDehixTalent_id}`,
      );

      const data = await this.hireService.getRejectedDehixTalent(
        request.params.hireDehixTalent_id,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getRejectedDehixTalent: ${error.message}`);
      if (
        error.ERROR_CODES === "HIRE_DEHIX_TALENT_NOT_FOUND" ||
        error.message.includes("Hire Dehix Talent not found by id")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Hire Dehix Talent"),
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

  @PUT(UPDATE_BOOKMARKED_BY_ID, {
    schema: updateBookmarkedHireDehixTalentSchema,
  })
  async updateHireDehixTalentBookmarkedById(
    request: FastifyRequest<{
      Params: HireDehixTalentPathParams;
      Body: PutHireDehixTalentBookmarkedBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `HireController -> updateHireDehixTalentBookmarkedById -> Updating hireDehixTalent with ID: ${request.params.hireDehixTalent_id}`,
      );

      const data = await this.hireService.updateHireDehixTalentBookmarked(
        request.userId,
        request.params.hireDehixTalent_id,
        request.body,
      );
      reply
        .status(STATUS_CODES.SUCCESS)
        .send({ message: "Hire Dehix Talent updated", data });
    } catch (error: any) {
      this.logger.error(`Error in updateHireDehixTalentById: ${error.message}`);
      if (
        error.ERROR_CODES === "BUSINESS_NOT_FOUND" ||
        error.message.includes("Business with provided ID could not be found.")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Business"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.ERROR_CODES === "HIRE_DEHIX_TALENT_NOT_FOUND" ||
        error.message.includes("Hire Dehix Talent not found by id")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Hire Dehix Talent"),
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
