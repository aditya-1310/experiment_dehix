import { Service } from "fastify-decorators";
import { Model } from "mongoose";
import { BaseDAO } from "../common/base.dao";
import { IBid, BidModel, StatusEnum } from "../models/bid.entity";
import { StatusEnum as ProjectStatusEnum } from "../models/project.entity";
import { fetchDataWithQueries } from "../common/utils";

@Service()
export class BidDAO extends BaseDAO {
  model: Model<IBid>;

  constructor() {
    super();
    this.model = BidModel;
  }

  async createOne(data: any) {
    return this.model.create(data);
  }

  async getBidByEmail(email: string) {
    return this.model.findOne({ email }).lean().exec();
  }

  async findOneByEmail(email: string) {
    return this.model
      .findOne(
        { email },
        "id password firebase_id full_name email is_email_verified owner_id",
      )
      .lean()
      .exec();
  }

  async getById(id: string) {
    return this.model
      .findById(id, "id firebase_id full_name email is_email_verified owner_id")
      .lean()
      .exec();
  }

  async updateBid(condition: any, newData: any) {
    return this.model
      .findOneAndUpdate(condition, newData, { new: true })
      .exec();
  }

  async findBidById(id: string) {
    return this.model.findById(id).lean().exec();
  }

  async updateBidData(id: string, update: any) {
    return this.model.updateOne({ _id: id }, update).exec();
  }

  async deleteBid(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  async updateStatus(bid_id: string, status: StatusEnum) {
    if (!Object.values(StatusEnum).includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }
    return this.model.updateOne(
      { _id: bid_id },
      { $set: { bid_status: status } },
    );
  }

  async findBidByProjectId(project_id: string) {
    return this.model.find({ project_id });
  }

  async findBidByBidderId(bidder_id: string) {
    return this.model.find({ bidder_id });
  }

  async getAllBids(
    filters: Record<string, string[]>,
    page: string = "1",
    limit: string = "20",
  ) {
    try {
      return await fetchDataWithQueries(this.model, filters, page, limit);
    } catch (error: any) {
      throw new Error(`Failed to fetch bids: ${error.message}`);
    }
  }

  async getBidByProject(project_id: string) {
    return this.model.find({ project_id });
  }

  async getBidByProjectProfile(profile_id: string) {
    return this.model.find({ profile_id });
  }

  async getProjectByBidderId(bidder_id: string, status?: ProjectStatusEnum) {
    let bidStatus;

    // Determine the bidStatus based on the provided status
    // Map project status to bidStatus
    switch (status) {
      case ProjectStatusEnum.ACTIVE:
        bidStatus = StatusEnum.ACCEPTED;
        break;
      case ProjectStatusEnum.PENDING:
        bidStatus = StatusEnum.PENDING;
        break;
      case ProjectStatusEnum.REJECTED:
        bidStatus = StatusEnum.REJECTED;
        break;
      default:
        bidStatus = undefined; // No status filter
    }

    const matchStage: any = {
      bidder_id: bidder_id,
    };

    // If status is provided, add the bid_status condition to the match
    if (bidStatus) {
      matchStage.bid_status = bidStatus;
    }

    const result = await this.model.aggregate([
      {
        $match: matchStage, // Match based on bidder_id and optional bid_status
      },
      {
        $lookup: {
          from: "projects",
          localField: "project_id",
          foreignField: "_id",
          as: "projectData",
        },
      },
      {
        $unwind: "$projectData",
      },
      // Ensure we match the exact project status if a status is provided
      ...(status ? [{ $match: { "projectData.status": status } }] : []),
      {
        $replaceRoot: { newRoot: "$projectData" },
      },
    ]);

    return result;
  }
}
