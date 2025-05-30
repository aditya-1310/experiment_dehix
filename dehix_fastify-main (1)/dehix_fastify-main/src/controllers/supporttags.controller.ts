import { FastifyRequest, FastifyReply } from "fastify";
import { Controller, GET, Inject, PUT, POST, DELETE } from "fastify-decorators";
import {
  ERROR_CODES,
  RESPONSE_MESSAGE,
  STATUS_CODES,
} from "../common/constants";
import { AuthController } from "../common/auth.controller";
import {
  SUPPORT_TAGS_END_POINT,
  GET_ALL_SUPPORT_TAGS_END_POINT,
  GET_SUPPORT_TAG_BY_ID,
  CREATE_SUPPORT_TAG_END_POINT,
  DELETE_SUPPORT_TAG_END_POINT,
  UPDATE_SUPPORT_TAG_BY_ID,
} from "../constants/supporttags.constant";
import { SupportTagsService } from "../services/supporttags.service";
import { createSupportTagsSchema } from "../schema/v1/supporttags/supporttags.create";
import { createSupportTagsBody } from "../types/v1/supporttags/createSupportTags";
import { deleteSupportTagByIdSchema } from "../schema/v1/supporttags/supporttags.delete";
import { getSupportTagPathParams } from "../types/v1/supporttags/getSupportTags";
import { updateSupportTagByIdSchema } from "../schema/v1/supporttags/supporttags.update";
import { updateSupportTagsBody } from "../types/v1/supporttags/updateSupportTags";
import {
  getAllSupportTagsSchema,
  getSupportTagByIdSchema,
} from "../schema/v1/supporttags/supporttags.get";

@Controller({ route: SUPPORT_TAGS_END_POINT })
export default class SupportTagsController extends AuthController {
  @Inject(SupportTagsService)
  SupportTagsService!: SupportTagsService;

  @POST(CREATE_SUPPORT_TAG_END_POINT, { schema: createSupportTagsSchema })
  async createSupportTags(
    request: FastifyRequest<{ Body: createSupportTagsBody }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `SupportTagsController -> createSupportTags -> Creating a new support tag`,
      );

      const body: any = request.body;
      const data = await this.SupportTagsService.createSupportTags(body);
      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in createSupportTags: ${error.message}`);
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  @GET(GET_ALL_SUPPORT_TAGS_END_POINT, { schema: getAllSupportTagsSchema })
  async getAllSupportTags(request: FastifyRequest, reply: FastifyReply) {
    try {
      this.logger.info(
        `SupportTagsController -> getAllSupportTags -> Fetching all support tags`,
      );

      const data = await this.SupportTagsService.getAllSupportTags();

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getAllSupportTags: ${error.message}`);
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  @GET(GET_SUPPORT_TAG_BY_ID, { schema: getSupportTagByIdSchema })
  async getSupportTagById(
    request: FastifyRequest<{ Params: getSupportTagPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      const tagId = request.params.tag_id;

      this.logger.info(
        `SupportTagsController -> getSupportTagById -> Fetching support tag with ID ${tagId}`,
      );

      const data = await this.SupportTagsService.getSupportTagById(tagId);

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getSupportTagById: ${error.message}`);
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  @DELETE(DELETE_SUPPORT_TAG_END_POINT, { schema: deleteSupportTagByIdSchema })
  async deleteSupportTag(
    request: FastifyRequest<{ Params: getSupportTagPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `SupportTagsController -> deleteSupportTag -> Deleting support tag`,
      );

      const tagId: string = request.params.tag_id;
      const deleteNote =
        await this.SupportTagsService.deleteSupportTagById(tagId);

      reply.status(STATUS_CODES.SUCCESS).send({ message: deleteNote });
    } catch (error: any) {
      this.logger.error(`Error in delete support tag: ${error.message}`);
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

  @PUT(UPDATE_SUPPORT_TAG_BY_ID, { schema: updateSupportTagByIdSchema })
  async updateSupportTags(
    request: FastifyRequest<{
      Params: getSupportTagPathParams;
      Body: updateSupportTagsBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `SupportTagsController -> updateSupportTags -> Updating support tag`,
      );
      const tagId: string = request.params.tag_id;
      const tagData: any = request.body;

      const data = await this.SupportTagsService.updateSupportTagById(
        tagId,
        tagData,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in updating support tag: ${error.message}`);
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
