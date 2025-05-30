import { FastifyRequest, FastifyReply } from "fastify"; // Importing Fastify types for requests and replies
import { Controller, DELETE, GET, Inject, POST, PUT } from "fastify-decorators"; // Importing decorators for defining routes
import {
  STATUS_CODES,
  ERROR_CODES,
  RESPONSE_MESSAGE,
  GetFilterQueryParams,
} from "../common/constants"; // Importing common constants for status codes and error messages
import { AuthController } from "../common/auth.controller"; // Importing base controller for authorization
import {
  FAQ_ALL_ENDPOINT,
  FAQ_BY_TAG_ENDPOINT,
  FAQ_DELETE_BY_ID_ENDPOINT,
  FAQ_ENDPOINT,
  FAQ_UPDATE_BY_ID_ENDPOINT,
  UPDATE_STATUS_OF_FAQ_BY_FAQ_ID,
} from "../constants/faq.constant"; // Importing constants defining FAQ endpoints
import { FaqService } from "../services"; // Importing the FAQ service to handle business logic
import { createFaqSchema } from "../schema/v1/faq/faq.create"; // Importing schema for creating FAQ validation
import { CreateFaqBody } from "../types/v1/faq/createFaq"; // Importing type definitions for creating FAQ
import { DeleteFaqPathParams } from "../types/v1/faq/deleteFaq"; // Importing type definitions for deleting FAQ
import { deleteFaqSchema } from "../schema/v1/faq/faq.delete"; // Importing schema for deleting FAQ validation
import { getAllFaqSchema, getFaqsByTagSchema } from "../schema/v1/faq/faq.get"; // Importing schema for fetching all FAQs
import {
  PutFaqBody,
  PutFaqPathParams,
  PutFaqStatusBody,
} from "../types/v1/faq/updateFaq"; // Importing type definitions for updating FAQ
import {
  updateFaqSchema,
  updateFaqStatusSchema,
} from "../schema/v1/faq/faq.update"; // Importing schema for updating FAQ validation
import { extractFilters } from "../common/utils";
import { GetFaqByTagQueryParams } from "src/types/v1/faq/getFaq";

// Define the FaqController class with a base route of FAQ_ENDPOINT
@Controller({ route: FAQ_ENDPOINT })
export default class FaqController extends AuthController {
  // Inject the FaqService to be used in the controller
  @Inject(FaqService)
  faqService!: FaqService;

  // POST handler to create a new FAQ
  @POST("", { schema: createFaqSchema })
  async createFaq(
    request: FastifyRequest<{ Body: CreateFaqBody }>, // Expecting a request body matching createFaqBody type
    reply: FastifyReply, // Response object
  ) {
    try {
      // Log the creation request
      this.logger.info(`FaqController  -> createFaq -> create FAQ}`);
      // Call the faqService to create a new FAQ with the provided body data
      const data = await this.faqService.create(request.body);

      // Send a success response with the newly created FAQ data
      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      // Log the error and send a server error response
      this.logger.error(`Error in CreateFaq: ${error.message}`);
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  // DELETE handler to delete a specific FAQ by ID
  @DELETE(FAQ_DELETE_BY_ID_ENDPOINT, { schema: deleteFaqSchema })
  async deleteFaqById(
    request: FastifyRequest<{ Params: DeleteFaqPathParams }>, // Expecting URL parameters matching DeleteFaqPathParams type
    reply: FastifyReply, // Response object
  ) {
    try {
      // Log the delete request with the FAQ ID
      this.logger.info(
        `FaqController -> deleteFaqById -> Deleting FAQ using: ${request.params.faq_id}`,
      );
      // Call the faqService to delete the FAQ by ID
      await this.faqService.deleteFaqById(request.params.faq_id);

      // Send a success response indicating the FAQ has been deleted
      reply.status(STATUS_CODES.SUCCESS).send({ message: "Faq deleted" });
    } catch (error: any) {
      // Log the error and check if it's a "not found" error
      this.logger.error(`Error in delete faq: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Data not found")
      ) {
        // Send a 404 response if the FAQ was not found
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Faq"),
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

  // GET handler to fetch all FAQs
  @GET(FAQ_ALL_ENDPOINT, { schema: getAllFaqSchema })
  async getAllFaqs(
    request: FastifyRequest<{ Querystring: GetFilterQueryParams }>,
    reply: FastifyReply,
  ) {
    try {
      // Log the request to fetch all FAQs
      this.logger.info(`faqController -> getAllFaqs -> Fetching Faqs`);

      const { page, limit } = request.query;
      const filters = extractFilters(request.url);

      // Call the faqService to retrieve all FAQs
      const data = await this.faqService.getAllFaqs(filters, page, limit);

      // Send a success response with the fetched FAQs
      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      // Log the error and check if it's a "not found" error
      this.logger.error(`Error in getAllFaqs: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Faq not found")
      ) {
        // Send a 404 response if no FAQs were found
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Faq"),
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

  // PUT handler to update a specific FAQ by ID
  @PUT(FAQ_UPDATE_BY_ID_ENDPOINT, { schema: updateFaqSchema })
  async updateFaqById(
    request: FastifyRequest<{
      Params: DeleteFaqPathParams; // Expecting URL parameters matching DeleteFaqPathParams type
      Body: PutFaqBody; // Expecting a request body matching PutFaqBody type
    }>,
    reply: FastifyReply, // Response object
  ) {
    try {
      // Log the request to update an FAQ by ID
      this.logger.info(
        `FaqController -> updateFaqById -> Updating FAQ using: ${request.params.faq_id}`,
      );

      // Call the faqService to update the FAQ with the provided ID and body
      const data = await this.faqService.updateFaqById(
        request.params.faq_id,
        request.body,
      );

      // If no data is found, send a 404 response
      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Faq"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      // Send a success response with the updated FAQ data
      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      // Log the error and check if it's a "not found" error
      this.logger.error(`Error in updateFaqById: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Data not found")
      ) {
        // Send a 404 response if the FAQ was not found
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
  @PUT(UPDATE_STATUS_OF_FAQ_BY_FAQ_ID, {
    schema: updateFaqStatusSchema,
  })
  async updateFaqStatusById(
    request: FastifyRequest<{
      Params: PutFaqPathParams;
      Body: PutFaqStatusBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FaqController -> updateFaqStatusById -> Updating status with ID: ${request.params.faq_id}`,
      );

      const data = await this.faqService.updateFaqStatus(
        request.params.faq_id,
        request.body.status,
      );

      reply.status(STATUS_CODES.SUCCESS).send({
        message: "Faq Status updated",
        data,
      });
    } catch (error: any) {
      this.logger.error(`Error in updateFaqStatusById: ${error.message}`);

      if (
        error.ERROR_CODES === "FAQ_NOT_FOUND" ||
        error.message.includes("Faq with provided ID could not be found.")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Faq"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.ERROR_CODES === "FAQ_NOT_FOUND" ||
        error.message.includes("Faq not found by id")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("FAQ"),
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

  @GET(FAQ_BY_TAG_ENDPOINT, { schema: getFaqsByTagSchema })
  async getFaqsByTag(
    request: FastifyRequest<{ Querystring: GetFaqByTagQueryParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(`faqController -> getAllFaqs -> Fetching Faqs`);

      const { tagNames } = request.query;

      const data = await this.faqService.getFaqsByTag(tagNames);

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      // Log the error and check if it's a "not found" error
      this.logger.error(`Error in getAllFaqs: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Faq not found")
      ) {
        // Send a 404 response if no FAQs were found
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Faq"),
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
