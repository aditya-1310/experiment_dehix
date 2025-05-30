import { FastifyRequest, FastifyReply } from "fastify";
import { Controller, GET, Inject, POST, DELETE, PUT } from "fastify-decorators";
import { ProjectDomainService } from "../services";
import {
  STATUS_CODES,
  ERROR_CODES,
  RESPONSE_MESSAGE,
  GetFilterQueryParams,
} from "../common/constants";

import { AuthController } from "../common/auth.controller";
import {
  PROJECT_DOMAIN_ENDPOINT,
  PROJECT_DOMAIN_BY_ID_ENDPOINT,
  PROJECT_DOMAIN_GET_ALL_ENDPOINT,
} from "../constants/projectDomain.constant";
import { createProjectDomainSchema } from "../schema/v1/projectDomain/projectDomain.create";
import { CreateProjectDomainBody } from "../types/v1/projectDomain/createProjectDomain";
import { deleteProjectDomainSchema } from "../schema/v1/projectDomain/projectDomain.delete";
import { DeleteProjectDomainPathParams } from "../types/v1/projectDomain/deleteProjectDomain";
import { getAllProjectDomainSchema } from "../schema/v1/projectDomain/projectDomain.get";
import { updateProjectDomainSchema } from "../schema/v1/projectDomain/projectDomain.update";
import {
  PutProjectDomainBody,
  PutProjectDomainPathParams,
} from "../types/v1/projectDomain/updateProjectDomain";
import { extractFilters } from "../common/utils";

@Controller({ route: PROJECT_DOMAIN_ENDPOINT })
export default class ProjectDomainController extends AuthController {
  @Inject(ProjectDomainService)
  projectDomainService!: ProjectDomainService;

  @POST("", { schema: createProjectDomainSchema })
  async createProjectDomain(
    request: FastifyRequest<{ Body: CreateProjectDomainBody }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `ProjectDomainController -> createProjectDomain -> Creating project-domain`,
      );

      const data = await this.projectDomainService.createProjectDomain(
        request.body,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in createProjectDomain: ${error.message}`);
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  @DELETE(PROJECT_DOMAIN_BY_ID_ENDPOINT, {
    schema: deleteProjectDomainSchema,
  })
  async deleteProjectDomainById(
    request: FastifyRequest<{ Params: DeleteProjectDomainPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `ProjectDomainController -> deleteProjectDomainById -> Deleting ProjectDomain using: ${request.params.projectDomain_id}`,
      );
      await this.projectDomainService.deleteProjectDomainById(
        request.params.projectDomain_id,
      );

      reply
        .status(STATUS_CODES.SUCCESS)
        .send({ message: "Project Domain deleted" });
    } catch (error: any) {
      this.logger.error(`Error in delete domain: ${error.message}`);
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

  @GET(PROJECT_DOMAIN_GET_ALL_ENDPOINT, { schema: getAllProjectDomainSchema })
  async getallProjectDomain(
    request: FastifyRequest<{ Querystring: GetFilterQueryParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `projectDomainController -> getallProjectDomain -> Fetching project domain`,
      );

      const { page, limit } = request.query;
      const filters = extractFilters(request.url);

      const data = await this.projectDomainService.getAllProjectDomain(
        filters,
        page,
        limit,
      );

      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("project domain"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }
      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getallProjectDomain: ${error.message}`);
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  @PUT(PROJECT_DOMAIN_BY_ID_ENDPOINT, {
    schema: updateProjectDomainSchema,
  })
  async updateProjectDomain(
    request: FastifyRequest<{
      Params: PutProjectDomainPathParams;
      Body: PutProjectDomainBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `ProjectDomainController -> updateProjectDomain -> Updating ProjectDomain using: ${request.params.projectDomain_id}`,
      );

      const data = await this.projectDomainService.updateProjectDomain(
        request.params.projectDomain_id,
        request.body,
      );

      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("ProjectDomain"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in updateProjectDomain: ${error.message}`);
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
}
