/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyRequest, FastifyReply } from "fastify";
import { Controller, GET, Inject, POST, DELETE, PUT } from "fastify-decorators";
import { SkillsService } from "../services/skills.service";
import {
  STATUS_CODES,
  ERROR_CODES,
  RESPONSE_MESSAGE,
  GetFilterQueryParams,
} from "../common/constants";

import {
  SKILLS_ENDPOINT,
  SKILLS_BY_ID_ENDPOINT,
  SKILLS_GET_ALL_ENDPOINT,
} from "../constants/skills.constant";

import { getSkillsSchema } from "../schema/v1/skills/skills.getAll";
import { AuthController } from "../common/auth.controller";
import { createSkillSchema } from "../schema/v1/skills/skills.create";
import { createSkillBody } from "../types/v1/skills/createSkill";
import { DeleteSkillPathParams } from "../types/v1/skills/deleteSkill";
import { deleteSkillSchema } from "../schema/v1/skills/skills.delete";
import { GetSkillPathParams } from "../types/v1/skills/getSkill";
import {
  PutSkillBody,
  PutSkillPathParams,
} from "../types/v1/skills/updateSkill";
import { updateSkillSchema } from "../schema/v1/skills/skills.update";
import { getSkillByIdSchema } from "../schema/v1/skills/skills.get";
import { ADMIN_ALL_SKILL_ENDPOINT } from "../constants/admin.constant";
import { extractFilters } from "../common/utils";

@Controller({ route: SKILLS_ENDPOINT })
export default class SkillsController extends AuthController {
  @Inject(SkillsService)
  skillsService!: SkillsService;

  @POST("", { schema: createSkillSchema })
  async createSkills(
    request: FastifyRequest<{ Body: createSkillBody }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(`SkillsController -> createSkills -> Creating skills`);

      const data = await this.skillsService.create(request.body);

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in createSkills: ${error.message}`);
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  @DELETE(SKILLS_BY_ID_ENDPOINT, { schema: deleteSkillSchema })
  async deleteSkillById(
    request: FastifyRequest<{ Params: DeleteSkillPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `SkillsController -> deleteSkillById -> Deleting SKILL using: ${request.params.skill_id}`,
      );
      await this.skillsService.deleteSkillById(request.params.skill_id);

      reply.status(STATUS_CODES.SUCCESS).send({ message: "Skill deleted" });
    } catch (error: any) {
      this.logger.error(`Error in deleteSkillById: ${error.message}`);
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

  @GET(SKILLS_GET_ALL_ENDPOINT, { schema: getSkillsSchema })
  async getSkills(
    request: FastifyRequest<{ Querystring: GetFilterQueryParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(`SkillsController -> getSkills -> Fetching skills`);

      const { page, limit } = request.query;
      const filters = extractFilters(request.url);

      const data = await this.skillsService.getAllSkills(filters, page, limit);

      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Skills"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getSkills: ${error.message}`);
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
  @GET(ADMIN_ALL_SKILL_ENDPOINT, { schema: getSkillsSchema })
  async getSkillsAdmin(request: FastifyRequest, reply: FastifyReply) {
    try {
      this.logger.info(`SkillsController -> getSkills -> Fetching skills`);

      const data = await this.skillsService.getAllSkillsAdmin();

      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Skills"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getSkills: ${error.message}`);
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

  @GET(SKILLS_BY_ID_ENDPOINT, { schema: getSkillByIdSchema })
  async getSkillById(
    request: FastifyRequest<{ Params: GetSkillPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `SkillsController -> getSkillById -> Fetching skill using: ${request.params.skill_id}`,
      );

      const data = await this.skillsService.getSkillById(
        request.params.skill_id,
      );

      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Skill"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getSkillById: ${error.message}`);
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

  @PUT(SKILLS_BY_ID_ENDPOINT, { schema: updateSkillSchema })
  async updateSkill(
    request: FastifyRequest<{
      Params: PutSkillPathParams;
      Body: PutSkillBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `SkillsController -> updateSkillById -> Updating skill using: ${request.params.skill_id}`,
      );

      const data = await this.skillsService.updateSkill(
        request.params.skill_id,
        request.body,
      );

      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Skill"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in updateSkill: ${error.message}`);
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
