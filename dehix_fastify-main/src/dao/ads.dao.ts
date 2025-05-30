import { Service } from "fastify-decorators";
import { Model } from "mongoose";
import { BaseDAO } from "../common/base.dao";
import { AdsModel, IAds } from "../models/ads.entity";
import { PutAdsBody } from "../types/v1/ads/updateAds";
import { fetchDataWithQueries } from "../common/utils";

@Service()
export class AdsDAO extends BaseDAO {
  model: Model<IAds>;

  constructor() {
    super();
    this.model = AdsModel;
  }

  async createAds(data: any) {
    return this.model.create(data);
  }

  async findAds(ads_id: string) {
    return this.model.findById(ads_id);
  }

  async findAdsById(id: string) {
    return this.model.findById(id);
  }

  async deleteAds(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  async updateAdsById(ads_id: string, update: PutAdsBody) {
    return this.model.findOneAndUpdate({ _id: ads_id }, update, {
      new: true,
    });
  }

  async getAllAds(
    filters: Record<string, string[]>,
    page: string = "1",
    limit: string = "20",
  ) {
    return await fetchDataWithQueries(this.model, filters, page, limit);
  }
}
