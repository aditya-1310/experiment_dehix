import { Service, Inject } from "fastify-decorators";
import { BaseService } from "../common/base.service";
import { NotFoundError } from "../common/errors";
import { ERROR_CODES, RESPONSE_MESSAGE } from "../common/constants";
import { TokenRequestDAO } from "../dao/tokenrequest.dao";
import { TokenRequestStatus } from "../models/tokenrequest.entity";
import { businessDAO, FreelancerDAO } from "../dao";

@Service()
export class TokenRequestService extends BaseService {
  @Inject(TokenRequestDAO)
  private TokenRequestDAO!: TokenRequestDAO;

  @Inject(FreelancerDAO)
  private FreelancerDAO!: FreelancerDAO;

  @Inject(businessDAO)
  private businessDAO!: businessDAO;

  // Create a new Token Request
  async createTokenRequest(body: any) {
    this.logger.info("TokenRequestService: create: Creating new token request");

    return await this.TokenRequestDAO.createTokenRequest(body);
  }

  // Get all Token Requests
  async getAllTokenRequest(page: string, limit: string) {
    this.logger.info(
      "TokenRequestService: getAllTokenRequest: Fetching all Token Request",
    );

    const tokenRequests = await this.TokenRequestDAO.getAllTokenRequest(
      page,
      limit,
    );

    if (tokenRequests.length === 0) {
      this.logger.error(
        "TokenRequestService: getAllTokenRequest: No Token Request found",
      );
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("TokenRequest"),
        ERROR_CODES.NOT_FOUND,
      );
    }

    return tokenRequests;
  }

  // Delete Token Request by ID
  async deleteTokenRequestById(tokenrequest_id: string) {
    this.logger.info(
      `TokenRequestService: deleteTokenRequestById: Deleting Token Request ID: ${tokenrequest_id}`,
    );

    const checkTokenRequest =
      await this.TokenRequestDAO.getTokenRequestByID(tokenrequest_id);
    if (!checkTokenRequest) {
      this.logger.error(
        `TokenRequestService: deleteTokenRequestById: Token Request ID ${tokenrequest_id} not found`,
      );
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }

    const deleteTokenRequest =
      await this.TokenRequestDAO.deleteTokenRequest(tokenrequest_id);
    return deleteTokenRequest;
  }

  // Update TokenRequest by ID
  async updateTokenRequestById(tokenrequest_id: string, body: any) {
    this.logger.info(
      `TokenRequestService: updateTokenRequestById: Updating Token Request ID: ${tokenrequest_id}`,
    );

    const checkTokenRequest =
      await this.TokenRequestDAO.getTokenRequestByID(tokenrequest_id);
    if (!checkTokenRequest) {
      this.logger.error(
        `TokenRequestService: updateTokenRequestById: Token Request ID ${tokenrequest_id} not found`,
      );
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }

    const updatedTokenRequest = await this.TokenRequestDAO.updateTokenRequest(
      tokenrequest_id,
      body,
    );
    return updatedTokenRequest;
  }

  // Update Token Request status by ID
  async updateTokenRequestStatus(
    tokenrequest_id: string,
    status: TokenRequestStatus,
  ) {
    try {
      this.logger.info(
        `TokenRequestService: updateTokenRequestStatus: Updating status for Token Request ID: ${tokenrequest_id} to ${status}`,
      );

      const result = await this.TokenRequestDAO.updateTokenRequestStatus(
        tokenrequest_id,
        status,
      );

      if (!result) {
        throw new Error(
          "Failed to update the Token Request status. No Token Request found.",
        );
      }
      if (result.status == "APPROVED") {
        let user;
        if (result.userType == "FREELANCER") {
          user = await this.FreelancerDAO.findFreelancerById(result.userId);
          await this.FreelancerDAO.updateFreelancerConnects(
            result.userId,
            user.connects + Number(process.env.CONNECTS_UNIT),
          );
        }
        if (result.userType == "BUSINESS") {
          user = await this.businessDAO.getBusinessById(result.userId);
          await this.businessDAO.updateBusinessConnects(
            result.userId,
            user.connects + process.env.CONNECTS_UNIT,
          );
        }
      }
      return result;
    } catch (error: any) {
      this.logger.error(
        `TokenRequestService: updateTokenRequestStatus: ${error.message}`,
      );
      throw new Error("Failed to update TokenRequest status");
    }
  }

  // Get TokenRequest by ID
  async getTokenRequestById(tokenrequest_id: string) {
    this.logger.info(
      `TokenRequestService: getTokenRequestById: Fetching Token Request for ID: ${tokenrequest_id}`,
    );

    const checkTokenRequest =
      await this.TokenRequestDAO.getTokenRequestByID(tokenrequest_id);
    if (!checkTokenRequest) {
      this.logger.error(
        `TokenRequestService: getTokenRequestById: Token Request ID ${tokenrequest_id} not found`,
      );
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }

    return checkTokenRequest;
  }

  async getTokenRequestsByUserId(user_id: string, latestConnects: boolean) {
    this.logger.info(
      `TokenRequestService: getTokenRequestsByUserId: Fetching Token Request for user ID: ${user_id}`,
    );

    const tokenRequests = await this.TokenRequestDAO.getTokenRequestByUserID(
      user_id,
      latestConnects,
    );
    if (!tokenRequests) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("token requests"),
        ERROR_CODES.NOT_FOUND,
      );
    }

    return tokenRequests;
  }
}
