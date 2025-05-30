/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyRequest, FastifyReply } from "fastify"; // Import Fastify types for request and reply
import { Controller, DELETE, GET, Inject, POST, PUT } from "fastify-decorators"; // Import decorators for creating controller methods
import { BidService } from "../services"; // Import the BidService for handling bid-related logic
import {
  STATUS_CODES,
  ERROR_CODES,
  RESPONSE_MESSAGE,
  GetFilterQueryParams,
} from "../common/constants";
// import { GetBidPathParams } from "../types/v1";
import {
  ALL_BID_ENDPOINT,
  BID_ENDPOINT,
  BID_ID_BUSINESS_END_POINT,
  BID_ID_FREELANCER_END_POINT,
  DELETE_BID_END_POINT,
  GET_BID_BY_PROJECT_END_POINT,
  GET_BID_BY_PROJECT_PROFILE_END_POINT,
  UPDATE_BID_BY_ID_ENDPOINT,
  UPDATE_BID_STATUS_BY_ID_ENDPOINT,
} from "../constants/bid.constant"; // Import endpoint constants for bid operations
import { AuthController } from "../common/auth.controller"; // Base controller for authentication
import { bidApplySchema } from "../schema/v1/bid/bid.apply"; // Import schema for bid application validation
import { BidApplyBody } from "../types/v1/bid/bidApplyBody"; // Import type for bid application body
import {
  BidStatusBody,
  PutBidBody,
  PutBidPathParams,
} from "../types/v1/bid/updateBid"; // Import types for updating bids
import {
  updateBidSchema,
  updateBidStatusSchema,
} from "../schema/v1/bid/bid.update"; // Import schemas for bid update validation
import {
  getAllBidsSchema,
  getBidForBidderIdSchema,
  getBidForProfileIdSchema,
  getBidForProjectIdSchema,
} from "../schema/v1/bid/bid.get"; // Import schemas for fetching bids
import {
  GetBidByBidderIdPathParams,
  GetBidByProjectIdPathParams,
} from "../types/v1/bid/getBid"; // Import types for getting bids by various parameters
import { DeleteBidPathParams } from "../types/v1/bid/deleteBid"; // Import type for deleting a bid
import { deleteBidSchema } from "../schema/v1/bid/bid.delete"; // Import schema for bid deletion validation
import { UserNotificationService } from "../services/userNotification.service";
import {
  IUserNotification,
  UserNotificationTypeEnum,
} from "../models/userNotification.entity";
import { extractFilters } from "../common/utils";

@Controller({ route: BID_ENDPOINT }) // Controller for handling bid-related routes
export default class BidController extends AuthController {
  @Inject(BidService) // Injecting BidService to use its methods
  bidService!: BidService; // Declare BidService instance

  @Inject(UserNotificationService) // Injecting BidService to use its methods
  userNotificationService!: UserNotificationService;

  // POST endpoint for applying to a bid
  @POST("", { schema: bidApplySchema })
  async bidApply(
    request: FastifyRequest<{ Body: BidApplyBody }>, // Request body must match the BidApplyBody schema
    reply: FastifyReply, // Fastify reply object
  ) {
    try {
      this.logger.info(`BidController -> getById -> Applying for bid}`);
      const data = await this.bidService.create(request.body);

      const Notification: IUserNotification = {
        message: "Bid has been recieved.",
        type: UserNotificationTypeEnum.BID,
        entity: "Business",
        path: "/business/project/id",
        userId: [request.body.bidder_id],
      };
      await this.userNotificationService.createNotification(Notification);

      reply.status(STATUS_CODES.SUCCESS).send({
        data,
      });
    } catch (error: any) {
      this.logger.error(`Error in create bid: ${error.message}`); // Log the error message
      // Handle various errors and send appropriate responses
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Bid not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Bid"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (error.message.includes("Project not found by id")) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Project"),
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

  @PUT(UPDATE_BID_BY_ID_ENDPOINT, { schema: updateBidSchema })
  async updateBidById(
    request: FastifyRequest<{
      Params: PutBidPathParams; // Parameters must match PutBidPathParams type
      Body: PutBidBody; // Body must match PutBidBody type
    }>,
    reply: FastifyReply, // Fastify reply object
  ) {
    try {
      this.logger.info(
        `BidController -> updateBidById -> Update bid for bidder using ID: ${request.params.bid_id}`, // Log the update attempt
      );

      const data = await this.bidService.updateBid(
        request.params.bid_id, // Pass the bid ID to the service
        request.body, // Pass the updated bid data
      );

      reply.status(STATUS_CODES.SUCCESS).send({ message: "Bid updated", data }); // Send successful response
    } catch (error: any) {
      this.logger.error(`Error in update bid project: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Bid not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Bid"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (error.message.includes("Project not found by id")) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Project"),
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

  // PUT endpoint for updating the status of a bid by its ID
  @PUT(UPDATE_BID_STATUS_BY_ID_ENDPOINT, { schema: updateBidStatusSchema }) // Specify schema for validation
  async updateBidStatusById(
    request: FastifyRequest<{
      Params: PutBidPathParams; // Parameters must match PutBidPathParams type
      Body: BidStatusBody; // Body must match BidStatusBody type
    }>,
    reply: FastifyReply, // Fastify reply object
  ) {
    try {
      this.logger.info(
        `BidController -> updateBidStatusById -> Update bid status using ID: ${request.params.bid_id}`, // Log the status update attempt
      );

      await this.bidService.bidStatusUpdate(
        request.params.bid_id, // Pass the bid ID to the service
        request.body.bid_status, // Pass the new bid status
      );

      const bidStatus = request.body.bid_status;
      if (bidStatus === "ACCEPTED") {
        const Notification: IUserNotification = {
          message: "Your bid has been accepted.",
          type: UserNotificationTypeEnum.BID,
          entity: "Freelancer",
          path: "/freelancer/project/completed",
          userId: [request.params.bid_id],
        };
        await this.userNotificationService.createNotification(Notification);
      } else if (bidStatus === "REJECTED") {
        const Notification: IUserNotification = {
          message: "Your bid has been rejected.",
          type: UserNotificationTypeEnum.BID,
          entity: "Freelancer",
          path: "/freelancer/project/rejected",
          userId: [request.params.bid_id],
        };
        await this.userNotificationService.createNotification(Notification);
      }
      reply
        .status(STATUS_CODES.SUCCESS)
        .send({ message: "Status Update Successful" }); // Send successful response
    } catch (error: any) {
      this.logger.error(`Error in Update status: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Bid not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Bid"),
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

  // GET endpoint to fetch bids associated with a specific project ID for businesses
  @GET(BID_ID_BUSINESS_END_POINT, { schema: getBidForProjectIdSchema }) // Specify schema for validation
  async getBidBusiness(
    request: FastifyRequest<{ Params: GetBidByProjectIdPathParams }>, // Request parameters must match GetBidByProjectIdPathParams type
    reply: FastifyReply, // Fastify reply object
  ) {
    try {
      this.logger.info(
        `BidController -> getBidBusiness -> Fetching Business Bid for project ID: ${request.params.project_id}`, // Log the fetching attempt
      );

      const data = await this.bidService.getBidBusiness(
        request.params.project_id, // Call service to fetch bids for the specified project ID
      );

      if (!data || data.length === 0) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Bid"), // Handle case where no bids are found
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data }); // Send successful response with bid data
    } catch (error: any) {
      this.logger.error(`Error in get business bid: ${error.message}`); // Log the error
      // Handle errors and send appropriate responses
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Bid not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Bid"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (error.message.includes("Project not found by id")) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Project"),
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

  @GET(BID_ID_FREELANCER_END_POINT, { schema: getBidForBidderIdSchema })
  async getBidFreelancer(
    request: FastifyRequest<{ Params: GetBidByBidderIdPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `BidController -> getBidFreelancer -> Fetching Freelancer Bid for Bidder ID: ${request.params.bidder_id}`,
      );

      const data = await this.bidService.getBidFreelancer(
        request.params.bidder_id,
      );

      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Bid"), // Handle case where no bids are found
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getBidFreelancer: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Bid not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Bid"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (error.message.includes("Project not found by id")) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Project"),
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

  @DELETE(DELETE_BID_END_POINT, { schema: deleteBidSchema })
  async deleteBid(
    request: FastifyRequest<{ Params: DeleteBidPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `BidController -> Delete Bid -> Deleting Bid for Bid ID: ${request.params.bid_id} `,
      );

      await this.bidService.deleteBid(request.params.bid_id);
      return reply
        .status(STATUS_CODES.SUCCESS)
        .send({ message: "Bid deleted" });
    } catch (error: any) {
      this.logger.error(`Error in delete bid: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Bid not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Bid"),
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

  // GET endpoint to fetch all bids
  @GET(ALL_BID_ENDPOINT, { schema: getAllBidsSchema }) // Specify schema for validation
  async getAllBids(
    request: FastifyRequest<{ Querystring: GetFilterQueryParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(`BidController -> getAllBids -> Fetching bids`);

      const { page, limit } = request.query;
      const filters = extractFilters(request.url);

      const data = await this.bidService.getAllBids(filters, page, limit);

      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Bids"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data }); // Send successful response with bid data
    } catch (error: any) {
      this.logger.error(`Error in getAllBids: ${error.message}`);
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
  @GET(GET_BID_BY_PROJECT_END_POINT, { schema: getBidForProjectIdSchema })
  async GetAllBidsByProjectId(
    request: FastifyRequest<{ Params: GetBidByProjectIdPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `BidController -> GetAllBidsByProjectId -> Fetching bids`,
      );
      const data = await this.bidService.getAllBidByProject(
        request.params.project_id,
      );
      reply.status(STATUS_CODES.SUCCESS).send({ data: data });
    } catch (error: any) {
      if (error.message.includes("Project not found by id")) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Project"),
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
  @GET(GET_BID_BY_PROJECT_PROFILE_END_POINT, {
    schema: getBidForProfileIdSchema,
  })
  async GetAllBidsByProjectProfileId(
    request: FastifyRequest<{ Params: GetBidByProjectIdPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `BidController -> GetAllBidsByProjectProfileId-> Fetching bids`,
      );
      const data = await this.bidService.getAllBidByProjectProfile(
        request.params.project_id,
        request.params.profile_id,
      );
      reply.status(STATUS_CODES.SUCCESS).send({ data: data });
    } catch (error: any) {
      if (error.message.includes("Project not found by id")) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Project"),
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
