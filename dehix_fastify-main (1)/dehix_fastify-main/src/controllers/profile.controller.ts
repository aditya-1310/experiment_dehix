import { FastifyRequest, FastifyReply } from "fastify";
import { Controller, DELETE, GET, Inject, PUT } from "fastify-decorators";
import { AuthController } from "../common/auth.controller";
import {
  ERROR_CODES,
  RESPONSE_MESSAGE,
  STATUS_CODES,
} from "../common/constants";
import {
  BUSINESS_PROFILE_END_POINT,
  GET_BUSINESS_SINGLE_PROJECT_PROFILE_BY_ID,
  UPDATE_BUSINESS_PROJECT_PROFILE_BY_ID,
  DELETE_PROJECT_PROFILE_BY_ID,
} from "../constants/business.constant";
import { BusinessService } from "../services/business.service";
import { deleteProjectProfileByIdSchema } from "../schema/v1/projectProfile/profile.delete";
import { getProjectProfileByIdSchema } from "../schema/v1/projectProfile/profile.get";
import { updateProjectProfileByIdSchema } from "../schema/v1/projectProfile/profile.update";
import { GetProjectProfilePathParams } from "../types/v1/projectProfile/getProfile";
import { DeleteProjectProfilePathParams } from "../types/v1/projectProfile/deleteProfile";
import {
  UpdateProjectProfilePathParams,
  UpdateProjectProfileBody,
} from "../types/v1/projectProfile/updateProfile";

// Define the controller with the main business profile endpoint
@Controller({ route: BUSINESS_PROFILE_END_POINT })
export default class BusinessController extends AuthController {
  // Inject BusinessService to handle business-related logic
  @Inject(BusinessService)
  BusinessService!: BusinessService;

  @GET(GET_BUSINESS_SINGLE_PROJECT_PROFILE_BY_ID, {
    schema: getProjectProfileByIdSchema,
  })
  // Handler to get a single project profile by project and profile IDs
  async getProjectProfileById(
    request: FastifyRequest<{ Params: GetProjectProfilePathParams }>,
    reply: FastifyReply,
  ) {
    try {
      // Log the attempt to fetch a project profile by its ID
      this.logger.info(
        `Fetching project profile with ID ${request.params.profile_id}`,
      );

      // Fetch the project profile by project ID and profile ID
      const data = await this.BusinessService.getProjectProfileById(
        request.params.project_id,
        request.params.profile_id,
      );

      // If no data is found, return a not found error
      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Profile"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      // Return the profile data
      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      // Log any errors encountered
      this.logger.error(`Error fetching profile: ${error.message}`);

      // Handle specific cases such as no data being found or project not being found
      if (
        error.code === ERROR_CODES.NOT_FOUND ||
        error.message.includes("Data not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.DATA_NOT_FOUND,
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.ERROR_CODES === "PROJECT_NOT_FOUND" ||
        error.message.includes("Project by provided ID was not found.")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Project"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        // Return a server error for any other issues
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @PUT(UPDATE_BUSINESS_PROJECT_PROFILE_BY_ID, {
    schema: updateProjectProfileByIdSchema,
  })
  // Handler to update a project profile by its ID
  async updateProjectProfileById(
    request: FastifyRequest<{
      Params: UpdateProjectProfilePathParams;
      Body: UpdateProjectProfileBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      // Log the attempt to update a project profile
      this.logger.info(
        `Updating project profile with ID ${request.params.profile_id}`,
      );

      // Update the project profile by project and profile ID using the provided body
      const data = await this.BusinessService.updateProjectProfileById(
        request.params.project_id,
        request.params.profile_id,
        request.body,
      );

      // If no data is found, return a not found error
      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Profile"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ message: "update sucessfull" });
    } catch (error: any) {
      // Log any errors encountered during the update
      this.logger.error(`Error updating profile: ${error.message}`);

      // Handle specific cases where data is not found
      if (
        error.code === ERROR_CODES.NOT_FOUND ||
        error.message.includes("Data not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.DATA_NOT_FOUND,
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.ERROR_CODES === "PROJECT_NOT_FOUND" ||
        error.message.includes("Project by provided ID was not found.")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Project"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Profile by provided ID was not found.")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Project"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        // Return a server error for any other issues
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @DELETE(DELETE_PROJECT_PROFILE_BY_ID, {
    schema: deleteProjectProfileByIdSchema,
  })
  // Handler to delete a project profile by project and profile IDs
  async deleteProjectProfileById(
    request: FastifyRequest<{ Params: DeleteProjectProfilePathParams }>,
    reply: FastifyReply,
  ) {
    try {
      // Log the attempt to delete a project profile
      this.logger.info(
        `Deleting project profile with ID ${request.params.profile_id}`,
      );

      // Delete the project profile by project and profile IDs
      const deleted = await this.BusinessService.deleteProjectProfileById(
        request.params.project_id,
        request.params.profile_id,
      );

      // If the profile was not found, return a not found error
      if (!deleted) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Profile"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      // Return success if the deletion was successful
      reply.status(STATUS_CODES.SUCCESS).send({
        message: "Profile deleted",
      });
    } catch (error: any) {
      // Log any errors encountered during the deletion
      this.logger.error(`Error deleting profile: ${error.message}`);

      // Handle cases where data or project is not found
      if (
        error.code === ERROR_CODES.NOT_FOUND ||
        error.message.includes("Data not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.DATA_NOT_FOUND,
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.ERROR_CODES === "PROJECT_NOT_FOUND" ||
        error.message.includes("Project by provided ID was not found.")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Project"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Profile by provided ID was not found.")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Project"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        // Return a server error for any other issues
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }
}
