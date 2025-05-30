/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyRequest, FastifyReply } from "fastify";
import { Controller, GET, Inject, POST, DELETE, PUT } from "fastify-decorators";
import { DomainService } from "../services"; // Importing the domain service
import {
  STATUS_CODES,
  ERROR_CODES,
  RESPONSE_MESSAGE,
  GetFilterQueryParams,
} from "../common/constants"; // Importing common constants for status codes and error messages

// Importing endpoints for the domain controller
import {
  DOMAIN_ENDPOINT,
  DOMAIN_ALL_ENDPOINT,
  DOMAIN_DELETE_BY_ID_ENDPOINT,
  DOMAIN_ID_ENDPOINT,
  DOMAIN_BY_ID_ENDPOINT,
  GET_ALL_ADMIN_ENDPOINT,
} from "../constants/domain.constant";

// Importing schemas for validation
import { createDomainSchema } from "../schema/v1/domain/domain.create";
import { createDomainBody } from "../types/v1/domain/createDomain";
import { DeleteDomainPathParams } from "../types/v1/domain/deleteDomain";
import { deleteDomainSchema } from "../schema/v1/domain/domain.delete";
import { getDomainSchema } from "../schema/v1/domain/domain.getAll";
import { AuthController } from "../common/auth.controller";
import { getDomainByIdSchema } from "../schema/v1/domain/domain.get";
import { GetDomainPathParams } from "../types/v1/domain/getDomain";
import { updateDomainSchema } from "../schema/v1/domain/domain.update";
import {
  PutDomainBody,
  PutDomainPathParams,
} from "../types/v1/domain/updateDomain";
import { extractFilters } from "../common/utils";

// Define the DomainController class with a base route of DOMAIN_ENDPOINT
@Controller({ route: DOMAIN_ENDPOINT })
export default class DomainController extends AuthController {
  // Inject the DomainService to be used in the controller
  @Inject(DomainService)
  domainService!: DomainService;

  // POST handler to create a domain
  @POST(DOMAIN_ID_ENDPOINT, { schema: createDomainSchema })
  async createDomain(
    request: FastifyRequest<{ Body: createDomainBody }>,
    reply: FastifyReply,
  ) {
    try {
      // Log the creation request
      this.logger.info(`DomainController -> createDomain -> Creating domain`);

      // Call the domainService to create a new domain with the provided body data
      const data = await this.domainService.create(request.body);

      // Send a success response with the newly created domain data
      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      // Log the error and send a server error response
      this.logger.error(`Error in createDomain: ${error.message}`);
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  // DELETE handler to delete a domain by ID
  @DELETE(DOMAIN_DELETE_BY_ID_ENDPOINT, { schema: deleteDomainSchema })
  async deleteDomainById(
    request: FastifyRequest<{ Params: DeleteDomainPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      // Log the delete request with the domain ID
      this.logger.info(
        `DomainController -> deleteDomainById -> Deleting DOMAIN using: ${request.params.domain_id}`,
      );

      // Call the domainService to delete the domain by ID
      await this.domainService.deleteDomainById(request.params.domain_id);

      // Send a success response indicating the domain has been deleted
      reply.status(STATUS_CODES.SUCCESS).send({ message: "Domain deleted" });
    } catch (error: any) {
      // Log the error and check if it's a "not found" error
      this.logger.error(`Error in delete domain: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Data not found")
      ) {
        // Send a 404 response if the domain was not found
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.DATA_NOT_FOUND,
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        // Send a server error response for any other errors
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  // GET handler to retrieve all domains
  @GET(DOMAIN_ALL_ENDPOINT, { schema: getDomainSchema })
  async getDomain(
    request: FastifyRequest<{ Querystring: GetFilterQueryParams }>,
    reply: FastifyReply,
  ) {
    try {
      // Log the request to fetch all domains
      this.logger.info(`DomainController -> getDomain -> Fetching domain`);

      const { page, limit } = request.query;
      const filters = extractFilters(request.url);
      // Call the domainService to get all domains
      const data = await this.domainService.getAllDomain(filters, page, limit);

      // If no data is returned, send a 404 response
      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Domain"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      // Send a success response with the retrieved domains
      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      // Log the error and check if it's a "not found" error
      this.logger.error(`Error in getDomain: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Data not found")
      ) {
        // Send a 404 response if no domains were found
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.DATA_NOT_FOUND,
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        // Send a server error response for any other errors
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }
  @GET(GET_ALL_ADMIN_ENDPOINT, { schema: getDomainSchema })
  async getDomainAdmin(request: FastifyRequest, reply: FastifyReply) {
    try {
      this.logger.info(`DomainController -> getDomain -> Fetching domain`);

      const data = await this.domainService.getAllDomainAdmin();

      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Domain"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getDomain: ${error.message}`);
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

  // GET handler to retrieve a domain by ID
  @GET(DOMAIN_BY_ID_ENDPOINT, { schema: getDomainByIdSchema })
  async getDomainById(
    request: FastifyRequest<{ Params: GetDomainPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      // Log the request to fetch a domain by ID
      this.logger.info(
        `DomainController -> getDomainById -> Fetching domain using: ${request.params.domain_id}`,
      );

      // Call the domainService to get the domain by ID
      const data = await this.domainService.getDomainById(
        request.params.domain_id,
      );

      // If no data is found, send a 404 response
      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Domain"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      // Send a success response with the domain data
      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      // Log the error and check if it's a "not found" error
      this.logger.error(`Error in getDomainById: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Data not found")
      ) {
        // Send a 404 response if the domain was not found
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.DATA_NOT_FOUND,
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        // Send a server error response for any other errors
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  // PUT handler to update a domain by ID
  @PUT(DOMAIN_BY_ID_ENDPOINT, { schema: updateDomainSchema })
  async updateDomain(
    request: FastifyRequest<{
      Params: PutDomainPathParams;
      Body: PutDomainBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      // Log the request to update a domain by ID
      this.logger.info(
        `DomainController -> updateDomain -> Updating domain using: ${request.params.domain_id}`,
      );

      // Call the domainService to update the domain with the provided ID and body
      const data = await this.domainService.updateDomain(
        request.params.domain_id,
        request.body,
      );

      // If no data is found, send a 404 response
      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Domain"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      // Send a success response with the updated domain data
      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      // Log the error and check if it's a "not found" error
      this.logger.error(`Error in updateDomain: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Data not found")
      ) {
        // Send a 404 response if the domain was not found
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.DATA_NOT_FOUND,
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        // Send a server error response for any other errors
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }
}
