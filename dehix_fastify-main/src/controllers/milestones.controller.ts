import { FastifyRequest, FastifyReply } from "fastify";
import {
  Controller,
  GET,
  POST,
  PUT,
  DELETE,
  Inject,
  PATCH,
} from "fastify-decorators";
import { MilestonesService } from "../services/milestones.service";
import {
  IMilestone,
  TaskRequestBody,
  TaskRequestParams,
  TaskUpdateBody,
} from "../models/milestones.entity";
import {
  ERROR_CODES,
  RESPONSE_MESSAGE,
  STATUS_CODES,
} from "../common/constants";
import {
  CREATE_MILESTONE_END_POINT,
  DELETE_MILESTONE_END_POINT,
  GET_MILESTONES_END_POINT,
  MILESTONES_END_POINT,
  UPDATE_MILESTONE_BY_ID,
  UPDATE_TASK,
  UPDATE_TASK_REQUEST,
} from "../constants/milestones.constant";
import { AuthController } from "../common/auth.controller";
import { createMilestoneSchema } from "../schema/v1/milestones/milestones.create";
import { deleteMilestoneSchema } from "../schema/v1/milestones/milestones.delete";
import { getMilestoneSchema } from "../schema/v1/milestones/milestones.get";
import {
  updateMilestoneSchema,
  updateTaskFreelancerDeatilSchema,
  updateTaskFreelancerSchema,
} from "../schema/v1/milestones/milestones.update";

@Controller({ route: MILESTONES_END_POINT })
export default class MilestonesController extends AuthController {
  @Inject(MilestonesService)
  milestonesService!: MilestonesService;

  // Create a new milestone
  @POST(CREATE_MILESTONE_END_POINT, { schema: createMilestoneSchema })
  async createMilestone(
    request: FastifyRequest<{ Body: IMilestone }>,
    reply: FastifyReply,
  ) {
    try {
      const createdMilestone = await this.milestonesService.createMilestone(
        request.body,
      );
      reply.status(STATUS_CODES.SUCCESS).send({
        message: "Milestone created successfully",
        data: createdMilestone,
      });
    } catch (error: any) {
      this.logger.error(error);
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  // Fetch all milestones for a user
  @GET(GET_MILESTONES_END_POINT, { schema: getMilestoneSchema })
  async getMilestones(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { projectId } = request.query as { projectId: string };
      const milestones = await this.milestonesService.getMilestones({
        projectId,
      });
      this.logger.info(milestones);
      reply.status(STATUS_CODES.SUCCESS).send({
        message: "Milestones fetched successfully",
        data: milestones,
      });
    } catch (error: any) {
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  @PATCH(UPDATE_TASK_REQUEST, { schema: updateTaskFreelancerSchema })
  async updateTaskFreelancers(
    request: FastifyRequest<{
      Params: TaskRequestParams;
      Body: TaskUpdateBody;
    }>,
    reply: FastifyReply,
  ) {
    const { milestoneId, storyId, taskId } = request.params;
    const {
      updatePermissionFreelancer,
      updatePermissionBusiness,
      acceptanceFreelancer,
      acceptanceBusiness,
    } = request.body;

    try {
      const result = await this.milestonesService.updateTaskAndFreelancers(
        milestoneId,
        storyId,
        taskId,
        updatePermissionFreelancer,
        updatePermissionBusiness,
        acceptanceBusiness,
        acceptanceFreelancer,
      );

      return reply.status(200).send(result);
    } catch (error) {
      return reply.status(500).send({
        message: "Internal Server Error",
        code: 500,
      });
    }
  }

  @PATCH(UPDATE_TASK, { schema: updateTaskFreelancerDeatilSchema })
  async updateTaskFreelancersDetails(
    request: FastifyRequest<{
      Params: TaskRequestParams;
      Body: TaskRequestBody;
    }>,
    reply: FastifyReply,
  ) {
    const { milestoneId, storyId, taskId } = request.params;
    const { title, summary, taskStatus } = request.body;

    try {
      const result = await this.milestonesService.updateTaskDetails(
        milestoneId,
        storyId,
        taskId,
        title,
        summary,
        taskStatus,
      );

      return reply.status(200).send(result);
    } catch (error) {
      return reply.status(500).send({
        message: "Internal Server Error",
        code: 500,
      });
    }
  }

  // Update a milestone by ID
  @PUT(UPDATE_MILESTONE_BY_ID, { schema: updateMilestoneSchema })
  async updateMilestoneById(
    request: FastifyRequest<{
      Params: { milestoneId: string };
      Body: Partial<IMilestone>;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { milestoneId } = request.params;
      const updatedMilestone = await this.milestonesService.updateMilestoneById(
        milestoneId,
        request.body,
      );

      reply.status(STATUS_CODES.SUCCESS).send({
        message: "Milestone updated successfully",
        newMilestone: updatedMilestone,
      });
    } catch (error: any) {
      if (error.message.includes("not found")) {
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

  // Delete a milestone by ID
  @DELETE(DELETE_MILESTONE_END_POINT, { schema: deleteMilestoneSchema })
  async deleteMilestoneById(
    request: FastifyRequest<{ Params: { milestoneId: string } }>,
    reply: FastifyReply,
  ) {
    try {
      const { milestoneId } = request.params;
      const deletedMilestone =
        await this.milestonesService.deleteMilestoneById(milestoneId);

      if (!deletedMilestone) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.DATA_NOT_FOUND,
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SUCCESS).send({
          message: "Milestone deleted successfully",
          data: deletedMilestone,
        });
      }
    } catch (error: any) {
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }
}
