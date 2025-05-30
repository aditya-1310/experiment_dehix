import { Service, Inject } from "fastify-decorators";
import { BaseService } from "../common/base.service";
import { BidApplyBody } from "../types/v1/bid/bidApplyBody";
import { BidDAO } from "../dao/bid.dao";
import { NotFoundError } from "../common/errors";
import { ERROR_CODES, RESPONSE_MESSAGE } from "../common/constants";
import { businessDAO, FreelancerDAO } from "../dao";
import { ProjectDAO } from "../dao/project.dao";
import { StatusEnum } from "../models/bid.entity"; // Enum imported here

@Service()
export class BidService extends BaseService {
  @Inject(BidDAO)
  private BidDAO!: BidDAO;
  @Inject(FreelancerDAO)
  private FreelancerDao!: FreelancerDAO;
  @Inject(ProjectDAO)
  private ProjectDao!: ProjectDAO;
  @Inject(businessDAO)
  private BusinesssDao!: businessDAO;

  /**
   * Service method to register a new FREELANCER
   * @param body
   * @param em
   * @returns
   */
  async create(body: BidApplyBody) {
    const {
      bidder_id,
      project_id,
      domain_id,
      current_price,
      profile_id,
      description,
      biddingValue,
    } = body;
    this.logger.info(`BidServices -> create -> Create`);
    const bidderExist = await this.FreelancerDao.findFreelancerById(bidder_id);
    const projectExist = await this.BusinesssDao.getProjectById(project_id);
    if (!bidderExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }
    if (!projectExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.PROJECT_NOT_FOUND_BY_ID,
        ERROR_CODES.NOT_FOUND,
      );
    }
    if (!bidderExist.connects || biddingValue > bidderExist.connects) {
      throw new Error("Insufficient connects to place this bid.");
    }
    const bid: any = await this.BidDAO.createOne({
      bidder_id,
      project_id,
      domain_id,
      current_price,
      userName: bidderExist.userName,
      profile_id,
      description,
    });
    await this.BusinesssDao.updateTotalBidProfile(
      bidder_id,
      profile_id,
      project_id,
    );

    await this.BusinesssDao.updateProjectProfile(
      bid._id,
      bidder_id,
      project_id,
      profile_id,
    );
    if (bidderExist.connects) {
      bidderExist.connects = bidderExist.connects - biddingValue;
      await bidderExist.save({ validateBeforeSave: false });
    }

    return bid;
  }

  async updateBid(bid_id: string, bid: any) {
    this.logger.info(`BidServices -> updateBid Using bidId -> ${bid_id}`);
    const bidExist = await this.BidDAO.findBidById(bid_id);
    if (!bidExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Bid"),
        ERROR_CODES.NOT_FOUND,
      );
    }
    const data: any = await this.BidDAO.updateBid({ _id: bid_id }, bid);
    return data;
  }

  async bidStatusUpdate(bid_id: string, bid_status: StatusEnum): Promise<any> {
    this.logger.info(
      `BidServices -> updateBidStatus -> Updating Bid Status Using bidId -> ${bid_id}`,
    );

    if (!Object.values(StatusEnum).includes(bid_status)) {
      throw new Error(
        `Invalid status: ${bid_status}. Allowed values are: ${Object.values(
          StatusEnum,
        ).join(", ")}.`,
      );
    }

    const bidExist = await this.BidDAO.findBidById(bid_id);
    if (!bidExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Bid"),
        ERROR_CODES.NOT_FOUND,
      );
    }

    const data = await this.BidDAO.updateStatus(bid_id, bid_status);
    return data;
  }

  async getBidBusiness(project_id: string) {
    this.logger.info(`Bid Service: Getting business project bid`);
    const projectExist = await this.BusinesssDao.getProjectById(project_id);

    if (!projectExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.PROJECT_NOT_FOUND_BY_ID,
        ERROR_CODES.NOT_FOUND,
      );
    }
    const data = await this.BidDAO.findBidByProjectId(project_id);
    return data;
  }

  async getBidFreelancer(bidder_id: string) {
    this.logger.info(`Bid Service: Getting Freelancer project bid`);
    const bidderExist = await this.FreelancerDao.findFreelancerById(bidder_id);

    if (!bidderExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }

    const data = await this.BidDAO.findBidByBidderId(bidder_id);
    return data;
  }

  async deleteBid(id: string) {
    this.logger.info(`Bid Service: Deleting project bid`);
    const bidExist = await this.BidDAO.findBidById(id);
    if (!bidExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Bid"),
        ERROR_CODES.NOT_FOUND,
      );
    }
    const data = await this.BidDAO.deleteBid(id);
    return data;
  }

  async getAllBids(
    filters: Record<string, string[]>,
    page: string,
    limit: string,
  ) {
    this.logger.info("BidService: getAllBids: Fetching All Bids");

    const bids: any = await this.BidDAO.getAllBids(filters, page, limit);

    if (!bids) {
      this.logger.error("BidService: getAllBids: Bids not found");
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Bids"),
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    return bids;
  }

  async getAllBidByProject(project_id: string) {
    this.logger.info("BidService: getAllBidByProject: Fetching All Bids");
    const projectExist = await this.ProjectDao.getProjectById(project_id);

    if (!projectExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.PROJECT_NOT_FOUND_BY_ID,
        ERROR_CODES.NOT_FOUND,
      );
    }
    const data = await this.BidDAO.getBidByProject(project_id);

    return data;
  }

  async getAllBidByProjectProfile(project_id: string, profile_id: string) {
    this.logger.info(
      "BidService: getAllBidByProjectProfile: Fetching All Bids",
    );
    const projectExist = await this.ProjectDao.getProjectById(project_id);

    if (!projectExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.PROJECT_NOT_FOUND_BY_ID,
        ERROR_CODES.NOT_FOUND,
      );
    }
    const data = await this.BidDAO.getBidByProjectProfile(profile_id);

    return data;
  }
}
