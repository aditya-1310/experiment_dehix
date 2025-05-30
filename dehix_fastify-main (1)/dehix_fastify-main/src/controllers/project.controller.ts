import { FastifyRequest, FastifyReply } from "fastify";
import { Controller, DELETE, GET, Inject, POST, PUT } from "fastify-decorators";
import { AuthController } from "../common/auth.controller";
import {
  ERROR_CODES,
  GetFilterQueryParams,
  RESPONSE_MESSAGE,
  STATUS_CODES,
} from "../common/constants";

import {
  ALL_PROJECT_ENDPOINT,
  CREATE_BUSINESS_PROJECT_END_POINT,
  DELETE_BUSINESS_PROJECT_END_POINT,
  DELETE_PROJECT_PROFILE_BY_ID,
  GET_ALL_BUSINESS_PROJECT_END_POINT,
  GET_BUSINESS_PROJECT_BY_ID,
  GET_BUSINESS_SINGLE_PROJECT_BY_ID,
  GET_BUSINESS_SINGLE_PROJECT_PROFILE_BY_ID,
  UPDATE_BUSINESS_PROJECT_PROFILE_BY_ID,
  GET_PROJECT_AND_BIDS_DATA_BY_PROJECT_ID,
  GET_BUSINESS_SINGLE_PROJECT_BY_ID_WITH_OUT_CHECK,
  UPDATE_STATUS_BY_PROJECT_ID,
  PROJECT_END_POINT,
  UPDATE_BIDDING_DATE,
  GET_PROJECT_FRELANCERS,
} from "../constants/business.constant";
import { getBusinessProjectSchema } from "../schema/v1/business/business.get";
import { BusinessService } from "../services";
import { getProjectPathParams } from "../types/v1/project/postProject";
import { DeleteProjectPathParams } from "../types/v1/project/deleteProject";
import { IProject } from "../models/project.entity";
import {
  getAllProjectsSchema,
  getProjectFreelancers,
  getProjectSchema,
  getProjectsAndBidsSchema,
} from "../schema/v1/project/project.get";
import { createProjectSchema } from "../schema/v1/project/project.create";
import { deleteProjectSchema } from "../schema/v1/project/project.delete";
import { GetBusinessProjectQueryParams } from "../types/v1/business/getProjectStatus";
import { GetBusinessProjectForFreelancerPathParams } from "../types/v1/business/getBusinessProjectForFreelancer";
import { getProjectProfileByIdSchema } from "../schema/v1/projectProfile/profile.get";
import { GetProjectProfilePathParams } from "../types/v1/projectProfile/getProfile";
import { updateProjectProfileByIdSchema } from "../schema/v1/projectProfile/profile.update";
import {
  UpdateProjectProfileBody,
  UpdateProjectProfilePathParams,
} from "../types/v1/projectProfile/updateProfile";
import { deleteProjectProfileByIdSchema } from "../schema/v1/projectProfile/profile.delete";
import { DeleteProjectProfilePathParams } from "../types/v1/projectProfile/deleteProfile";
import {
  updateProjectStatusSchema,
  updateBidDateSchema,
} from "../schema/v1/project/project.update";
import {
  PutProjectPathParams,
  PutStatusProjectBody,
  PutBiddingDateProjectBody,
} from "../types/v1/project/updateProject";
import { extractFilters } from "../common/utils";

// Define the controller with the main business endpoint
@Controller({ route: PROJECT_END_POINT })
export default class BusinessController extends AuthController {
  // Inject BusinessService to handle business-related logic
  @Inject(BusinessService)
  BusinessService!: BusinessService;

  @GET(GET_PROJECT_FRELANCERS, { schema: getProjectFreelancers })
  async getProjectFreelancers(
    request: FastifyRequest<{ Params: { projectId: string } }>,
    reply: FastifyReply,
  ) {
    try {
      const { projectId } = request.params;

      this.logger.info(
        `ProjectController -> getProjectFreelancers -> Fetching freelancers for projectId: ${projectId}`,
      );

      if (!projectId) {
        reply.status(STATUS_CODES.BAD_REQUEST).send({
          message: "Project ID is required",
          code: ERROR_CODES.BAD_REQUEST_ERROR,
        });
        return;
      }

      const data =
        await this.BusinessService.getFreelancersByProjectId(projectId);

      reply.status(STATUS_CODES.SUCCESS).send(data);
    } catch (error: any) {
      this.logger.error(`Error in getProjectFreelancers: ${error.message}`);
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  // Handler to get all business projects with filters
  @GET(GET_ALL_BUSINESS_PROJECT_END_POINT, { schema: getProjectSchema })
  async getAllProjectBusiness(
    request: FastifyRequest<{
      Params: GetBusinessProjectForFreelancerPathParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      // Extract query parameters for filtering
      const { location, jobType, domain, skills, projectDomain } =
        request.query as {
          location: string;
          jobType: string;
          domain: string;
          skills: string;
          projectDomain: string;
        };

      // Split comma-separated values into arrays
      const locationArray = location ? location.split(",") : [];
      const jobTypeArray = jobType ? jobType.split(",") : [];
      const domainArray = domain ? domain.split(",") : [];
      const skillsArray = skills ? skills.split(",") : [];
      const projectDomainArray = projectDomain ? projectDomain.split(",") : [];

      // Log the filtering criteria
      this.logger.info(
        `BusinessController -> getAllProjectBusiness -> Fetching Business all projects with filters: Location: ${locationArray}, Job Type: ${jobTypeArray}, Domain: ${domainArray}, Skills: ${skillsArray}, ProjectDomain: ${projectDomainArray}`,
      );

      // Extract pagination details
      const { page, limit } = request.query as {
        page: string;
        limit: string;
      };

      // Fetch the filtered project data
      const data = await this.BusinessService.getAllProjectsData(
        {
          location: locationArray,
          jobType: jobTypeArray,
          domain: domainArray,
          skills: skillsArray,
          projectDomain: projectDomainArray,
        },
        request.userId,
        page,
        limit,
      );

      // Return the fetched data
      return reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error) {
      // Log any errors encountered during the request
      this.logger.error(error, "error in getAllProjectBusiness");
      return reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }
  // Handler to create a new business project
  @POST(CREATE_BUSINESS_PROJECT_END_POINT, { schema: createProjectSchema })
  async createBusinessProject(
    request: FastifyRequest<{ Params: getProjectPathParams; Body: IProject }>,
    reply: FastifyReply,
  ) {
    try {
      // Log the attempt to create a new project
      this.logger.info(`BusinessController -> create business project`);

      // Create a new project for the business
      const data = await this.BusinessService.createBusinessProject(
        request.userId,
        request.body,
      );

      // Return a 204 error if the data is invalid
      if (!data) {
        return reply.status(STATUS_CODES.NO_CONTENT).send({
          message: RESPONSE_MESSAGE.REQUEST_DATA_INVALID,
          code: ERROR_CODES.INVALID_DATA,
        });
      }

      // Return the newly created project data
      return reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      // Log and handle different types of errors
      this.logger.error(`Error in getBusiness: ${error.message}`);
      if (
        error.ERROR_CODES === "BUSINESS_NOT_FOUND" ||
        error.message.includes("Business with provided ID could not be found.")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Business"),
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
  // Handler to delete a business project by its ID
  @DELETE(DELETE_BUSINESS_PROJECT_END_POINT, { schema: deleteProjectSchema })
  async deleteBusinessProject(
    request: FastifyRequest<{ Params: DeleteProjectPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      // Log the attempt to delete the project
      this.logger.info(
        `BusinessController -> Delete ProjectBusiness -> Deleting Business All Project `,
      );

      // Delete the project by ID
      const data = await this.BusinessService.deleteBusinessProject(
        request.params.project_id,
      );

      // Return the deleted project data
      return reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error) {
      // Log any errors encountered during the request
      this.logger.info(error, "error in Delete Business Project");
      return reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  // Handler to get business project data by business ID and project status
  @GET(GET_BUSINESS_PROJECT_BY_ID, { schema: getBusinessProjectSchema })
  async getProjectById(
    request: FastifyRequest<{
      Querystring: GetBusinessProjectQueryParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      // Log the attempt to fetch projects for a business by ID
      this.logger.info(
        `BusinessController -> getBusinessProjects -> Fetching business projects for ID: ${request.userId}`,
      );

      const { status } = request.query;

      // Fetch the business project by its ID and status
      const data = await this.BusinessService.getBusinessProjectsById(
        request.userId,
        status,
      );

      // Send the project data
      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      // Log and handle different types of errors
      this.logger.error(`Error in getBusiness: ${error.message}`);
      if (
        error.ERROR_CODES === "BUSINESS_NOT_FOUND" ||
        error.message.includes("Business with provided ID could not be found.")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Business"),
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

  // Handler to fetch a single business project for a freelancer by project ID
  @GET(GET_BUSINESS_SINGLE_PROJECT_BY_ID, { schema: getProjectSchema })
  async getSingleProjectForFreelancer(
    request: FastifyRequest<{ Params: getProjectPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      // Log the attempt to fetch a single project for a freelancer
      this.logger.info(
        `BusinessController -> getBusinessSingleProjects -> Fetching business projects for ID: ${request.params.project_id}`,
      );

      // Fetch the single project by project ID
      const data =
        await this.BusinessService.getSingleProjectByIdWithVerification(
          request.params.project_id,
          request.userId,
        );

      // Send the project data
      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      // Log and handle different types of errors
      this.logger.error(`Error in getBusinessSingleProject: ${error.message}`);
      if (
        error.ERROR_CODES === "PROJECT_NOT_FOUND" ||
        error.message.includes("Project by provided ID was not found.")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Project"),
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

  @GET(GET_BUSINESS_SINGLE_PROJECT_BY_ID_WITH_OUT_CHECK, {
    schema: getProjectSchema,
  })
  // Handler to get a single project by its ID without verification checks
  async getSingleProjectById(
    request: FastifyRequest<{ Params: getProjectPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      // Log the attempt to fetch a project by its ID
      this.logger.info(
        `BusinessController -> getBusinessSingleProjects -> Fetching business projects for ID: ${request.params.project_id}`,
      );

      // Fetch the project data by ID from the service layer
      const data = await this.BusinessService.getSingleProjectById(
        request.params.project_id,
      );

      // Return the project data if found
      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      // Log the error if something goes wrong
      this.logger.error(`Error in getBusinessSingleProject: ${error.message}`);

      // Handle specific error cases, like project not being found
      if (
        error.ERROR_CODES === "PROJECT_NOT_FOUND" ||
        error.message.includes("Project by provided ID was not found.")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Project"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        // For any other errors, respond with a server error
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @GET(ALL_PROJECT_ENDPOINT, { schema: getAllProjectsSchema })
  // Handler to get all projects
  async getAllroject(
    request: FastifyRequest<{ Querystring: GetFilterQueryParams }>,
    reply: FastifyReply,
  ) {
    try {
      // Log the attempt to fetch all projects
      this.logger.info(
        `BusinessController -> getAllProject -> Fetching all projects`,
      );

      const { limit, page } = request.query;
      const filters = extractFilters(request.url);

      const data = await this.BusinessService.getAllProject(
        filters,
        page,
        limit,
      );

      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Project"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      // Log any errors that occur during the request
      this.logger.error(`Error in getAllroject: ${error.message}`);

      // Handle specific cases, such as no data being found
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Data not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.DATA_NOT_FOUND,
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

  @GET(GET_PROJECT_AND_BIDS_DATA_BY_PROJECT_ID, {
    schema: getProjectsAndBidsSchema,
  })
  // Handler to fetch project and related bid data by project ID
  async getProjectAndBidsDataByProjectId(
    request: FastifyRequest<{ Params: getProjectPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      // Log the attempt to fetch project and bids data
      this.logger.info(
        `BusinessController -> getProjectAndBidsDataByProjectId -> Fetching project and bids data for project ID: ${request.params.project_id}`,
      );

      // Fetch the project and bids data by project ID
      const data = await this.BusinessService.getProjectAndBidsData(
        request.params.project_id,
      );

      // If no data is found, return a not found error
      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Project"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      // Return the project and bids data
      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      // Log any errors encountered
      this.logger.error(
        `Error in getProjectAndBidsDataByProjectId: ${error.message}`,
      );
      console.log("Error codes->>>>>>>>>>>>>", error.ERROR_CODES);

      // Handle specific cases where the project is not found
      if (
        error.ERROR_CODES === "PROJECT_NOT_FOUND" ||
        error.message.includes("Project not found")
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

  @PUT(UPDATE_BIDDING_DATE, {
    schema: updateBidDateSchema,
  })
  async updateMaxBidDate(
    request: FastifyRequest<{
      Params: PutProjectPathParams;
      Body: PutBiddingDateProjectBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `Updating date for bidding with Project_ID ${request.params.project_id}`,
      );

      const maxBiddingDate = new Date(request.body.maxBiddingDate);
      const startBiddingDate = new Date(request.body.startBiddingDate);

      const data = await this.BusinessService.updateBiddingDate(
        request.params.project_id,
        maxBiddingDate,
        startBiddingDate,
      );

      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Project"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ message: "update sucessfull" });
    } catch (error: any) {
      this.logger.error(`Error updating Status: ${error.message}`);

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
        error.message.includes("Project by provided ID was not found.")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Project"),
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

  @PUT(UPDATE_STATUS_BY_PROJECT_ID, {
    schema: updateProjectStatusSchema,
  })
  // Handler to update the status of a project by its ID
  async updateStatusByProjectId(
    request: FastifyRequest<{
      Params: PutProjectPathParams;
      Body: PutStatusProjectBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      // Log the attempt to update project status
      this.logger.info(
        `Updating status with Project_ID ${request.params.project_id}`,
      );

      // Update the project status by project ID and status body
      const data = await this.BusinessService.updateProjectStatusByProjectID(
        request.params.project_id,
        request.body.status,
      );

      // If the project is not found, return a not found error
      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Profile"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ message: "update sucessful" });
    } catch (error: any) {
      // Log any errors encountered during the update
      this.logger.error(`Error updating Status: ${error.message}`);

      // Handle specific cases such as data or project not being found
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
}
