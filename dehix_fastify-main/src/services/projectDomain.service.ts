import { Service, Inject } from "fastify-decorators";

import { BaseService } from "../common/base.service";
import { NotFoundError } from "../common/errors";
import { ERROR_CODES, RESPONSE_MESSAGE } from "../common/constants";
import { ProjectDomainDAO } from "../dao";

@Service()
export class ProjectDomainService extends BaseService {
  @Inject(ProjectDomainDAO)
  private ProjectDomainDAO!: ProjectDomainDAO;

  async createProjectDomain(body: any) {
    const projectDomain: any =
      await this.ProjectDomainDAO.createProjectDomain(body);
    return projectDomain;
  }

  async deleteProjectDomainById(projectDomain_id: string) {
    this.logger.info(
      `ProjectDomainService: deleteProjectDomainById: Deleting ProjectDomain for ProjectDomain ID:${projectDomain_id}`,
    );

    const checkProjectDomain =
      await this.ProjectDomainDAO.findProjectDomain(projectDomain_id);
    if (!checkProjectDomain) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }
    const deleteProjectDomain =
      await this.ProjectDomainDAO.deleteProjectDomain(projectDomain_id);

    return deleteProjectDomain;
  }

  async getAllProjectDomain(
    filters: Record<string, string[]>,
    page: string,
    limit: string,
  ) {
    this.logger.info(
      "ProjectDomainService: getAllProjectDomain: Fetching All project domain ",
    );

    const projectDomains: any = await this.ProjectDomainDAO.getAllProjectDomain(
      filters,
      page,
      limit,
    );

    return projectDomains;
  }

  async getProjectDomainById(domain_id: string) {
    this.logger.info(
      `ProjectDomainService: getDomainById: Fetching Domain for Domain ID:${domain_id}`,
    );

    const checkDomain: any =
      await this.ProjectDomainDAO.findProjectDomain(domain_id);
    if (!checkDomain) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    const getDomain: any =
      await this.ProjectDomainDAO.findProjectDomainById(domain_id);

    return getDomain;
  }

  async updateProjectDomain(domain_id: string, body: any) {
    this.logger.info(
      `ProjectDomainService: updateDomain: Updating Domain for Domain ID:${domain_id}`,
    );

    const checkDomain =
      await this.ProjectDomainDAO.findProjectDomain(domain_id);
    if (!checkDomain) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }

    const data = await this.ProjectDomainDAO.updateProjectDomain(
      domain_id,
      body,
    );

    return data;
  }
}
