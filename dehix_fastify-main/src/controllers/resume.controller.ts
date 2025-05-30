import { FastifyRequest, FastifyReply } from "fastify";
import { Controller, POST, GET, PUT, DELETE } from "fastify-decorators";
import { ResumeDAO } from "../dao/resume.dao";
import { logger } from "../common/services/logger.service";
import { createResumeSchema } from "../schema/v1/resume/resume.create";
import { updateResumeSchema } from "../schema/v1/resume/resume.update";
import { getResumesSchema } from "../schema/v1/resume/resume.get";
import { deleteResumeSchema } from "../schema/v1/resume/resume.delete";
import {
  DELETE_RESUME_BY_ID,
  GET_RESUME_BY_ID,
  CREATE_RESUME_ENDPOINT,
  UPDATE_RESUME_BY_ID,
} from "../constants/resume.constant";
import { ResumeBody } from "../types/v1/resume/createResume";
import { STATUS_CODES } from "../common/constants";
import { UpdateResumeBody } from "../types/v1/resume/updateResume";
@Controller({ route: "/resume" })
export default class ResumeController {
  resumeDAO: ResumeDAO;

  constructor() {
    this.resumeDAO = new ResumeDAO();
  }

  // Create a new resume
  @POST(CREATE_RESUME_ENDPOINT, { schema: createResumeSchema })
  async createResume(
    request: FastifyRequest<{
      Body: ResumeBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      logger.info("Creating a new resume");
      const resumeData: ResumeBody = request.body;

      const createdResume = await this.resumeDAO.createResume(resumeData);

      return reply.status(STATUS_CODES.SUCCESS).send({
        message: "Resume created successfully",
        resume: createdResume,
      });
    } catch (error: any) {
      logger.error("Error creating resume", error.message);
      return reply.status(500).send({
        message: "Internal Server Error",
        code: "SERVER_ERROR",
      });
    }
  }

  // Fetch all resumes for a specific user
  @GET(GET_RESUME_BY_ID, {
    schema: getResumesSchema,
  })
  async getResumes(
    request: FastifyRequest<{
      Querystring: { userId: string };
    }>,
    reply: FastifyReply,
  ) {
    try {
      logger.info("Fetching resumes for a user");
      const { userId } = request.query;

      if (!userId) {
        return reply.status(400).send({
          message: "User ID is required",
          code: "BAD_REQUEST_ERROR",
        });
      }

      const resumes = await this.resumeDAO.getResumesByUserId(userId);
      return reply.status(200).send({
        message: "Resumes fetched successfully",
        resumes,
      });
    } catch (error: any) {
      logger.error("Error fetching resumes", error.message);
      return reply.status(500).send({
        message: "Internal Server Error",
        code: "SERVER_ERROR",
      });
    }
  }

  // Update an existing resume
  @PUT(UPDATE_RESUME_BY_ID, {
    schema: updateResumeSchema,
  })
  async updateResume(
    request: FastifyRequest<{
      Params: { resumeId: string };
      Body: UpdateResumeBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      logger.info("Updating a resume");
      const updateData: UpdateResumeBody = request.body;
      // Validate or convert dates for the database if necessary

      // Convert dates to Date objects for the database

      const { resumeId } = request.params;
      const updatedResume = await this.resumeDAO.updateResume(
        resumeId,
        updateData,
      );
      return reply.status(200).send({
        message: "Resume updated successfully",
        resume: updatedResume,
      });
    } catch (error: any) {
      logger.error("Error updating resume", error.message);
      return reply.status(500).send({
        message: "Internal Server Error",
        code: "SERVER_ERROR",
      });
    }
  }

  // Delete a resume by ID
  @DELETE(DELETE_RESUME_BY_ID, {
    schema: deleteResumeSchema,
  })
  async deleteResume(
    request: FastifyRequest<{
      Params: { resumeId: string };
    }>,
    reply: FastifyReply,
  ) {
    try {
      logger.info("Deleting a resume");
      const { resumeId } = request.params;

      await this.resumeDAO.deleteResume(resumeId);
      return reply.status(200).send({
        message: "Resume deleted successfully",
      });
    } catch (error: any) {
      logger.error("Error deleting resume", error.message);
      return reply.status(500).send({
        message: "Internal Server Error",
        code: "SERVER_ERROR",
      });
    }
  }
}
