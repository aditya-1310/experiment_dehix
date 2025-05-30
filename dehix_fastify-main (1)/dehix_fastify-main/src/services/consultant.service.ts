import { Inject, Service } from "fastify-decorators";
import { BidService } from "./bid.service";
import { ConsultantDao } from "../dao/consultant.dao";
import { NotFoundError } from "../common/errors";
import { ERROR_CODES, RESPONSE_MESSAGE } from "../common/constants";
@Service()
export class ConsultantService extends BidService {
  @Inject(ConsultantDao)
  private ConsultantDao!: ConsultantDao;

  async createConsultant(data: any) {
    this.logger.info("Service->consultant.service->createConsultant");
    const response = await this.ConsultantDao.createConsultant(data);
    return response;
  }
  async updateConsultantById(consultant_id: string, update: any) {
    this.logger.info("Service->consultant.service->updateConsultantById");
    const consultantExist =
      await this.ConsultantDao.getConsultantById(consultant_id);
    if (!consultantExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.CONSULTANT_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }
    const data = await this.ConsultantDao.updateConsultant(
      consultant_id,
      update,
    );
    return data;
  }
  async getAllConsultant(page: string, limit: string) {
    this.logger.info("Service->consultant.service->getAllConsultant");
    const data = await this.ConsultantDao.getAllConsultant(page, limit);
    return data;
  }

  async getConsultantById(consultant_id: string) {
    this.logger.info("Service->consultant.service->getConsultantById");
    const data = await this.ConsultantDao.getConsultantById(consultant_id);
    if (!data) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.CONSULTANT_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }
    return data;
  }

  async deleteConsultantById(consultant_id: string) {
    this.logger.info("Service->consultant.service->deleteConsultantById");
    const consultantExist =
      await this.ConsultantDao.getConsultantById(consultant_id);
    if (!consultantExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.CONSULTANT_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }
    const data = await this.ConsultantDao.deleteConsultant(consultant_id);
    return data;
  }
}
