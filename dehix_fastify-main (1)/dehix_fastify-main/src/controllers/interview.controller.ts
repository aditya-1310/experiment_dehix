import { Controller, DELETE, GET, Inject, POST, PUT } from "fastify-decorators";
import { AuthController } from "../common/auth.controller";
import {
  CREATE_INTERVIEW_END_POINT,
  INTERVIEW,
  UPDATE_INTERVIEW_END_POINT,
  COMPLETED_INTERVIEW_FOR_INTERVIEWEE,
  CURRENT_INTERVIEW_FOR_INTERVIEWEE,
  GET_ALL_INTERVIEW_BIDS,
  CREATE_INTERVIEW_BID,
  DELETE_INTERVIEW_END_POINT,
  DELETE_INTERVIEW_BID,
  UPDATE_INTERVIEW_BID,
  SELECT_INTERVIEW_BID,
  GET_INTERVIEW_BID,
  GET_ALL_INTERVIEWS,
  GET_INTERVIEWER_BY_TALENT,
  GET_INTERVIEWS_BY_INTERVIEWER_TALENT,
} from "../constants/interview.constant";
import {
  createInterviewBidsSchema,
  createInterviewSchema,
  selectInterviewBidSchema,
} from "../schema/v1/interview/interview.create";
import { InterviewService } from "../services/interview.service";
import { FastifyReply, FastifyRequest } from "fastify";
import {
  GetInterviewBidPathParams,
  GetInterviewerByTalentParams,
  GetInterviewPathParams,
  GetInterviewsByInterviewerTalent,
} from "../types/v1/interview/getInterview";
import {
  CreateInterviewBidPathParams,
  CreateInterviewPathParams,
  InterviewBidBody,
  InterviewBody,
} from "../types/v1/interview/createInterview";
import {
  ERROR_CODES,
  RESPONSE_MESSAGE,
  STATUS_CODES,
} from "../common/constants";
import {
  updateInterviewBidSchema,
  updateInterviewSchema,
} from "../schema/v1/interview/interview.update";
import {
  UpdateInterviewBidBody,
  updateInterviewBidPathParams,
  UpdateInterviewBody,
} from "../types/v1/interview/updateInterview";
import {
  getAllInterviewBidsSchema,
  getAllInterviewSchema,
  getInterviewBidSchema,
  getInterviewsByInterviewerTalentSchema,
  getInterviewSchema,
  getIntreviewerByTalentSchema,
} from "../schema/v1/interview/interview.get";
import { UserNotificationService } from "../services";
import {
  deleteInterviewBidSchema,
  deleteInterviewSchema,
} from "../schema/v1/interview/interview.delete";
// import {
//   IUserNotification,
//   UserNotificationTypeEnum,
// } from "../models/userNotification.entity";

@Controller({ route: INTERVIEW })
export default class InterviewController extends AuthController {
  @Inject(InterviewService)
  private InterviewService!: InterviewService;

  @Inject(UserNotificationService)
  userNotificationService!: UserNotificationService;

  @POST(CREATE_INTERVIEW_END_POINT, { schema: createInterviewSchema })
  async createInterview(
    request: FastifyRequest<{
      Params: CreateInterviewPathParams;
      Body: InterviewBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info("controllers->interview.controller->createInterview");
      const interview_data = {
        ...request.body,
        creatorId: request.params.creator_id,
      };
      const data = await this.InterviewService.createInterview(interview_data);
      // const InterviewerNotification: IUserNotification = {
      //   message: "Interview has been scheduled for interviewee on date.",
      //   type: UserNotificationTypeEnum.INTERVIEW,
      //   entity: "Freelaner",
      //   path: "/freelancer/interview/profile",
      //   userId: [request.params.interviewee_id],
      // };
      // await this.userNotificationService.createNotification(
      //   InterviewerNotification,
      // );

      // const IntervieweeNotification: IUserNotification = {
      //   message: "Interview has been scheduled on date.",
      //   type: UserNotificationTypeEnum.INTERVIEW,
      //   entity: "Freelaner",
      //   path: "/freelancer/scheduleInterview",
      //   userId: [request.params.interviewee_id],
      // };
      // await this.userNotificationService.createNotification(
      //   IntervieweeNotification,
      // );

      reply.status(STATUS_CODES.CREATED).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in create interview: ${error.message}`);
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
      } else if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Data not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Data"),
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

  @PUT(UPDATE_INTERVIEW_END_POINT, { schema: updateInterviewSchema })
  async updateInterviewById(
    request: FastifyRequest<{
      Params: GetInterviewPathParams;
      Body: UpdateInterviewBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info("controllers->interview.controller->updateInterview");
      const data = await this.InterviewService.updateInterview(
        request.params.interview_id,
        request.body,
      );

      // const Notification: IUserNotification = {
      //   message: "Interview has been changed for interviewee on date.",
      //   type: UserNotificationTypeEnum.INTERVIEW,
      //   entity: "Business",
      //   path: "/dashboard/business",
      //   userId: [request.params.interviewee_id],
      // };
      // await this.userNotificationService.createNotification(Notification);
      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`error in interview update: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Interview not found by id")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND(" Interview"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Data not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Data"),
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

  @DELETE(DELETE_INTERVIEW_END_POINT, { schema: deleteInterviewSchema })
  async deleteInterviewById(
    request: FastifyRequest<{
      Params: GetInterviewPathParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info("controllers->interview.controller->deleteInterview");
      const data = await this.InterviewService.deleteInterview(
        request.params.interview_id,
      );

      // const Notification: IUserNotification = {
      //   message: "Interview has been changed for interviewee on date.",
      //   type: UserNotificationTypeEnum.INTERVIEW,
      //   entity: "Business",
      //   path: "/dashboard/business",
      //   userId: [request.params.interviewee_id],
      // };
      // await this.userNotificationService.createNotification(Notification);
      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`error in interview  update: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Interview not found by id")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND(" Interview"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Data not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Data"),
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

  @GET(GET_ALL_INTERVIEWS, { schema: getAllInterviewSchema })
  async getAllInterview(request: FastifyRequest, reply: FastifyReply) {
    try {
      this.logger.info("controllers->interview.controller->getAllInterview");
      const {
        intervieweeId = null,
        interviewerId = null,
        interviewType = null,
        talentType = null,
        talentId = null,
        limit,
        page,
      } = request.query as {
        intervieweeId: string;
        interviewerId: string;
        interviewType: string;
        talentType: string;
        talentId: string;
        limit: string;
        page: string;
      };
      const data = await this.InterviewService.getAllInterviews(
        intervieweeId,
        interviewerId,
        interviewType,
        talentType,
        talentId,
        limit,
        page,
      );
      this.logger.info("interviews: ", data);
      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error) {
      reply
        .status(STATUS_CODES.SERVER_ERROR)
        .send({ message: "Internal server error" });
    }
  }

  @GET(COMPLETED_INTERVIEW_FOR_INTERVIEWEE, { schema: getInterviewSchema })
  async getCompletedInterviews(
    request: FastifyRequest<{
      Params: GetInterviewPathParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancersController -> getCompletedinterview -> Fetching completedinteview`,
      );

      const {
        interviewerId = null,
        intervieweeId = null,
        creatorId = null,
      } = request.query as {
        interviewerId: string;
        intervieweeId: string;
        creatorId: string;
      };
      let getById;
      if (interviewerId) {
        getById =
          await this.InterviewService.getInterviewByInterviewerId(
            interviewerId,
          );
        this.logger.info(getById);
      } else if (intervieweeId) {
        getById =
          await this.InterviewService.getInterviewByIntervieweeId(
            intervieweeId,
          );
      } else if (creatorId) {
        getById =
          await this.InterviewService.getInterviewByCreatorId(creatorId);
      }

      const data = await this.InterviewService.completedinterview(getById);

      if (!data || data.length === 0) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Completed Project"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getcompletedinterviews: ${error.message}`);
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

  @GET(CURRENT_INTERVIEW_FOR_INTERVIEWEE, { schema: getInterviewSchema })
  async getCurrentInterviews(request: FastifyRequest, reply: FastifyReply) {
    try {
      this.logger.info(
        `FreelancersController -> getCompletedinterview -> Fetching completedinteview`,
      );

      const {
        interviewerId = null,
        intervieweeId = null,
        creatorId = null,
      } = request.query as {
        interviewerId: string;
        intervieweeId: string;
        creatorId: string;
      };
      let getById;
      const isInterviewer = !!interviewerId;
      const isInterviewee = !!intervieweeId;
      const isCreator = !!creatorId;
      if (interviewerId) {
        getById =
          await this.InterviewService.getInterviewByInterviewerId(
            interviewerId,
          );
        this.logger.info(getById);
      } else if (intervieweeId) {
        getById =
          await this.InterviewService.getInterviewByIntervieweeId(
            intervieweeId,
          );
      } else if (creatorId) {
        getById =
          await this.InterviewService.getInterviewByCreatorId(creatorId);
      }
      const id = isInterviewer
        ? interviewerId
        : isInterviewee
          ? intervieweeId
          : creatorId;
      const data = await this.InterviewService.currentInterview(
        getById._id,
        isInterviewer,
        isInterviewee,
        isCreator,
        id,
      );

      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Current Interview"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getcurrentinterviews: ${error.message}`);
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

  @GET(GET_ALL_INTERVIEW_BIDS, { schema: getAllInterviewBidsSchema })
  async getAllInterviewBids(
    request: FastifyRequest<{ Params: GetInterviewPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info("controller->interview.controller->getInterviewBids");
      const data = await this.InterviewService.getInterviewBidsByInterviewId(
        request.params.interview_id,
      );

      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Interview Bids not found"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      return reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getcurrentinterviews: ${error.message}`);
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

  @GET(GET_INTERVIEW_BID, { schema: getInterviewBidSchema })
  async getInterviewBid(
    request: FastifyRequest<{ Params: GetInterviewBidPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      const interviewBid =
        await this.InterviewService.getInterviewBidsByInterviewerId(
          request.params.bid_id,
        );

      if (!interviewBid) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Interview Bid not found"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      return reply.status(STATUS_CODES.SUCCESS).send({ interviewBid });
    } catch (error: any) {
      this.logger.error(`Error in getcurrentinterviews: ${error.message}`);
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

  @POST(CREATE_INTERVIEW_BID, { schema: createInterviewBidsSchema })
  async createInterviewBid(
    request: FastifyRequest<{
      Params: CreateInterviewBidPathParams;
      Body: InterviewBidBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info("controllers->interview.controller->createInterviewBid");

      const data = await this.InterviewService.createInterviewBid(
        request.params.interview_id,
        request.body,
      );

      return reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in create interview bid: ${error.message}`);
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
      } else if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Data not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Data"),
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

  @PUT(UPDATE_INTERVIEW_BID, { schema: updateInterviewBidSchema })
  async updateInterviewBid(
    request: FastifyRequest<{
      Params: updateInterviewBidPathParams;
      Body: UpdateInterviewBidBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info("controllers->interview.controller->updateInterviewBid");

      const data = await this.InterviewService.updateInterviewBid(
        request.params.interview_id,
        request.params.bid_id,
        request.body,
      );

      return reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in create interview bid: ${error.message}`);
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
      } else if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Data not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Data"),
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

  @DELETE(DELETE_INTERVIEW_BID, { schema: deleteInterviewBidSchema })
  async deleteInterviewBid(
    request: FastifyRequest<{
      Params: updateInterviewBidPathParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info("controllers->interview.controller->deleteInterviewBid");

      const data = await this.InterviewService.deleteInterviewBid(
        request.params.interview_id,
        request.params.bid_id,
      );

      return reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in create interview bid: ${error.message}`);
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
      } else if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Data not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Data"),
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

  @POST(SELECT_INTERVIEW_BID, { schema: selectInterviewBidSchema })
  async selectInterviewBid(
    request: FastifyRequest<{
      Params: updateInterviewBidPathParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info("controllers->interview.controller->selectInterviewBid");

      const data = await this.InterviewService.selectInterviewBid(
        request.params.interview_id,
        request.params.bid_id,
      );

      return reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in select interview bid: ${error.message}`);
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
      } else if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Data not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Data"),
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

  @GET(GET_INTERVIEWER_BY_TALENT, { schema: getIntreviewerByTalentSchema })
  async getInterviewersByTalent(
    request: FastifyRequest<{
      Params: GetInterviewerByTalentParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        "controllers->interview.controller->getInterviewersByTalent",
      );

      const talentId = request.params.talent_id;

      const data =
        await this.InterviewService.getInterviewersByTalent(talentId);
      this.logger.info({ data });

      return reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in select interview bid: ${error.message}`);
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
      } else if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Data not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Data"),
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

  @GET(GET_INTERVIEWS_BY_INTERVIEWER_TALENT, {
    schema: getInterviewsByInterviewerTalentSchema,
  })
  async getInterviewsByInterviewerTalent(
    request: FastifyRequest<{ Params: GetInterviewsByInterviewerTalent }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        "controllers->interview.controller->getInterviewsByInterviewerTalent",
      );

      const data = await this.InterviewService.getInterviewsByInterviewerTalent(
        request.params.interviewer_id,
      );

      return reply.status(STATUS_CODES.SUCCESS).send(data);
    } catch (error: any) {
      this.logger.error(`Error in select interview bid: ${error.message}`);
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
      } else if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Data not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Data"),
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
