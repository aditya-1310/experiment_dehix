import { Service, Inject } from "fastify-decorators";
import { BaseService } from "../common/base.service";
import { NotFoundError } from "../common/errors";
import { ERROR_CODES, RESPONSE_MESSAGE } from "../common/constants";
import { AdsDAO } from "../dao";
import { PutAdsBody } from "../types/v1/ads/updateAds";

@Service()
export class AdsService extends BaseService {
  @Inject(AdsDAO)
  private AdsDAO!: AdsDAO;

  async create(body: any) {
    const ads: any = await this.AdsDAO.createAds(body);
    return ads;
  }

  async getAdsById(ads_id: string) {
    this.logger.info(
      `AdsService: getAdsById: Fetching Ads for Ads ID:${ads_id}`,
    );

    const checkAds: any = await this.AdsDAO.findAds(ads_id);
    if (!checkAds) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }

    const getAds: any = await this.AdsDAO.findAdsById(ads_id);

    return getAds;
  }

  async deleteAdsById(ads_id: string) {
    this.logger.info(
      `AdsService: deleteAdsById: Deleting Ads for Ads ID:${ads_id}`,
    );

    const checkAds: any = await this.AdsDAO.findAds(ads_id);

    if (!checkAds) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }

    const deleteAds: any = await this.AdsDAO.deleteAds(ads_id);

    return deleteAds;
  }

  async updateAds(ads_id: string, update: PutAdsBody) {
    this.logger.info(
      `AdsService: updateAds: Updating Ads for Ads ID:${ads_id}`,
    );

    const checkAds: any = await this.AdsDAO.findAdsById(ads_id);

    if (!checkAds) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }

    const data = await this.AdsDAO.updateAdsById(ads_id, update);

    return data;
  }

  async getAllAds(
    filters: Record<string, string[]>,
    page: string,
    limit: string,
  ) {
    this.logger.info(`AdsService: getAllAds: Fetching all Adss`);

    const data = await this.AdsDAO.getAllAds(filters, page, limit);
    return data;
  }
}
