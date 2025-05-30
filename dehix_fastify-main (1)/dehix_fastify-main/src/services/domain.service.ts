import { Service, Inject } from "fastify-decorators";

import { BaseService } from "../common/base.service";
import { NotFoundError } from "../common/errors";
import { ERROR_CODES, RESPONSE_MESSAGE } from "../common/constants";
import { DomainDAO } from "../dao/domain.dao";

@Service()
export class DomainService extends BaseService {
  @Inject(DomainDAO)
  private DomainDAO!: DomainDAO;

  async create(body: any) {
    const domain: any = await this.DomainDAO.createDomain(body);
    return domain;
  }

  async deleteDomainById(domain_id: string) {
    this.logger.info(
      `DomainService: deleteDomainById: Deleting Domain for Domain ID:${domain_id}`,
    );

    const checkDomain = await this.DomainDAO.findDomain(domain_id);
    if (!checkDomain) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }
    const deleteDomain = await this.DomainDAO.deleteDomain(domain_id);

    return deleteDomain;
  }

  async getAllDomain(
    filters: Record<string, string[]>,
    page: string,
    limit: string,
  ) {
    this.logger.info("DomainService: getAllDomain: Fetching All Domain ");

    const domain: any = await this.DomainDAO.getAllDomain(filters, page, limit);

    if (!domain) {
      this.logger.error("DomainService: getAllDomain: Domain not found ");
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Domain"),
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    return domain;
  }

  async getAllDomainAdmin() {
    this.logger.info("DomainService: getAllDomain: Fetching All Domain ");

    const domain: any = await this.DomainDAO.getAllDomainAdmin();

    if (!domain) {
      this.logger.error("DomainService: getAllDomain: Domain not found ");
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Domain"),
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    return domain;
  }
  async getDomainById(domain_id: string) {
    this.logger.info(
      `DomainService: getDomainById: Fetching Domain for Domain ID:${domain_id}`,
    );

    const checkDomain: any = await this.DomainDAO.findDomain(domain_id);

    if (!checkDomain) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    const getDomain: any = await this.DomainDAO.findDomainById(domain_id);

    return getDomain;
  }

  async updateDomain(domain_id: string, body: any) {
    this.logger.info(
      `DomainService: updateDomain: Updating Domain for Domain ID:${domain_id}`,
    );
    const checkDomain = await this.DomainDAO.findDomain(domain_id);
    if (!checkDomain) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }

    const data = await this.DomainDAO.updateDomain(domain_id, {
      ...body,
      status: body.status,
    });
    return data;
  }
}
