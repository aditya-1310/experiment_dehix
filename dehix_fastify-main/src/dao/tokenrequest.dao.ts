import { Service } from "fastify-decorators";
import { Model } from "mongoose";
import { BaseDAO } from "../common/base.dao";
import {
  TokenRequestModel,
  ITokenRequest,
  TokenRequestStatus,
} from "../models/tokenrequest.entity";

@Service()
export class TokenRequestDAO extends BaseDAO {
  model: Model<ITokenRequest>;

  constructor() {
    super();
    this.model = TokenRequestModel;
  }

  async createTokenRequest(data: any) {
    return this.model.create(data);
  }

  async getAllTokenRequest(page: string = "1", limit: string = "20") {
    const pages = parseInt(page) - 1;
    const pageSize = parseInt(limit);
    const pageIndex = pages * pageSize;

    return await this.model.find().skip(pageIndex).limit(pageSize).lean();
  }

  async getTokenRequestByID(tokenrequest_id: string) {
    return await this.model.findById(tokenrequest_id);
  }

  async getTokenRequestByUserID(user_id: string, latestConnects: boolean) {
    return await this.model
      .find({ userId: user_id })
      .sort(latestConnects ? { _id: -1 } : {})
      .limit(latestConnects ? 5 : 0);
  }

  async deleteTokenRequest(tokenrequest_id: string) {
    return this.model.findByIdAndDelete(tokenrequest_id);
  }

  async updateTokenRequest(tokenrequest_id: string, update: any) {
    return this.model.findByIdAndUpdate({ _id: tokenrequest_id }, update, {
      new: true,
    });
  }

  async updateTokenRequestStatus(
    tokenrequest_id: string,
    status: TokenRequestStatus,
  ) {
    try {
      return await this.model.findByIdAndUpdate(
        tokenrequest_id,
        { status },
        { new: true },
      );
    } catch (error) {
      console.error("Error updating TokenRequest status:", error);
      throw new Error("Failed to update TokenRequest status");
    }
  }
}
