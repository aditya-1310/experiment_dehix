import { FastifyRequest, FastifyReply } from "fastify";
import { Controller, DELETE, GET, Inject, POST, PUT } from "fastify-decorators";
import {
  STATUS_CODES,
  ERROR_CODES,
  RESPONSE_MESSAGE,
  GetFilterQueryParams,
} from "../common/constants";
import { AuthController } from "../common/auth.controller";
import { ADS_ENDPOINT, ADS_BY_ID_ENDPOINT } from "../constants/ads.constant";
import { AdsService } from "../services";
import { createAdsSchema } from "../schema/v1/ads/ads.create";
import { CreateAdsBody } from "../types/v1/ads/createAds";
import { getAdsSchema } from "../schema/v1/ads/ads.get";
import { GetAdsPathParams } from "../types/v1/ads/getAds";
import { deleteAdsSchema } from "../schema/v1/ads/ads.delete";
import { DeleteAdsPathParams } from "../types/v1/ads/deleteAds";
import { PutAdsBody } from "../types/v1/ads/updateAds";
import { updateAdsSchema } from "../schema/v1/ads/ads.update";
import { getAllAdsSchema } from "../schema/v1/ads/ads.get";
import { extractFilters } from "../common/utils";

@Controller({ route: ADS_ENDPOINT })
export default class AdsController extends AuthController {
  @Inject(AdsService)
  adsService!: AdsService;

  @POST("", { schema: createAdsSchema })
  async createAds(
    request: FastifyRequest<{ Body: CreateAdsBody }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(`AdsController  -> createAds -> create Ads}`);
      const data = await this.adsService.create(request.body);

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in CreateAds: ${error.message}`);
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  @GET(ADS_BY_ID_ENDPOINT, { schema: getAdsSchema })
  async getAdsById(
    request: FastifyRequest<{ Params: GetAdsPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(`AdsController  -> getAdsById -> get Ads}`);

      const data = await this.adsService.getAdsById(request.params.ads_id);

      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("ads"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getadsById: ${error.message}`);
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

  @DELETE(ADS_BY_ID_ENDPOINT, {
    schema: deleteAdsSchema,
  })
  async deleteAdsById(
    request: FastifyRequest<{ Params: DeleteAdsPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(`AdsController  -> deleteAdById -> delete Ads}`);

      await this.adsService.deleteAdsById(request.params.ads_id);

      reply.status(STATUS_CODES.SUCCESS).send({ message: "Ads deleted" });
    } catch (error: any) {
      this.logger.error(`Error in deleteAdsById: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Data not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Ads"),
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

  @PUT(ADS_BY_ID_ENDPOINT, { schema: updateAdsSchema })
  async updateAdsById(
    request: FastifyRequest<{
      Params: GetAdsPathParams;
      Body: PutAdsBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(`AdsController  -> updateAdsById -> update Ads}`);

      const data = await this.adsService.updateAds(
        request.params.ads_id,
        request.body,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in updateAdsById: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Data not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Ads"),
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

  @GET("", { schema: getAllAdsSchema })
  async getAllAds(
    request: FastifyRequest<{ Querystring: GetFilterQueryParams }>,
    reply: FastifyReply,
  ) {
    try {
      const { page, limit } = request.query;
      const filters = extractFilters(request.url);

      this.logger.info(`AdsController  -> getAllAds -> get all Ads}`);

      const data = await this.adsService.getAllAds(filters, page, limit);
      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getAllAds: ${error.message}`);
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }
}
