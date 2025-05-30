/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  BadTokenError,
  CreationError,
  NotFoundError,
  UnAuthorisedError,
  DataValidationError,
  BadRequestError,
  ConflictError,
  ServerError,
} from "./errors";
import {
  FastifyInstanceToken,
  Inject,
  ErrorHandler,
  Hook,
} from "fastify-decorators";
import { Logger } from "./services/logger.service";
import { ERROR_CODES } from "../common/constants";

/*
  Responsibilities of BaseController:
  1. Handle all error scenarios by using dedicated error handlers for various error types.
  2. Add CORS headers and manage response behavior using hooks.
*/

export abstract class BaseController {
  // Inject the Fastify instance to allow access to the Fastify server for logging, configuration, and request handling.
  @Inject(FastifyInstanceToken) fastifyInstance!: FastifyInstance;

  // Inject the Logger service for logging throughout the application.
  @Inject(Logger) logger!: Logger;

  /*
    Hook that runs on each request.
    Used to perform operations before the request is processed, such as setting request context.
    Currently, this is a placeholder hook with no specific logic.
  */
  @Hook("onRequest")
  addRequestContext(request, reply, done) {
    done(); // Proceed to the next lifecycle phase.
  }

  /*
    Hook that runs before the response is sent.
    Adds CORS headers to the response and ensures no caching.
    This is useful for enabling cross-origin requests and controlling how browsers handle caching.
  */
  @Hook("onSend")
  // eslint-disable-next-line
  async onReplySend(request, reply, payload, done) {
    reply.header("Access-Control-Allow-Origin", "*"); // Allow requests from all origins
    reply.header("Access-Control-Allow-Headers", "*"); // Allow all headers
    reply.header(
      "Access-Control-Allow-Methods",
      "OPTIONS, GET, PUT, PATCH, POST, DELETE",
    ); // Allow these HTTP methods
    reply.header("Cache-Control", "no-cache, no-store"); // Disable caching of responses
  }

  /*
    Hook that runs when the request is closed.
    This can be used to clean up resources or manage any post-request logic.
    Currently, this is a placeholder.
  */
  @Hook("onClose")
  async onRequestClose(request, reply, done) {
    done(); // Continue to the next stage of the request lifecycle.
  }

  // Error Handlers:

  /*
    Handles BadTokenError, triggered when a token is invalid or missing.
    Sends a 403 Forbidden response with a "Not Authorized" message.
  */
  @ErrorHandler(BadTokenError)
  handleTokenNotFound(
    error: BadTokenError,
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    reply
      .status(403)
      .send({ message: "Not Authorized", code: error.statusCode });
  }

  /*
    Handles UnAuthorisedError, triggered when the user is not authorized.
    Sends a 401 Unauthorized response with a specific error message.
  */
  @ErrorHandler(UnAuthorisedError)
  handleUnAuthorised(
    error: UnAuthorisedError,
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    reply.status(401).send({ message: error.message, code: error.statusCode });
  }

  /*
    Handles BadRequestError, triggered when a bad request is made (e.g., malformed input).
    Sends a 400 Bad Request response with an appropriate error message.
  */
  @ErrorHandler(BadRequestError)
  handleBadRequestError(
    error: UnAuthorisedError,
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    reply.status(400).send({ message: error.message, code: error.statusCode });
  }

  /*
    Handles ConflictError, triggered when there is a resource conflict (e.g., duplicate entry).
    Sends a 409 Conflict response with an appropriate error message.
  */
  @ErrorHandler(ConflictError)
  handleConflictError(
    error: UnAuthorisedError,
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    reply.status(409).send({ message: error.message, code: error.statusCode });
  }

  /*
    Handles CreationError, triggered when an error occurs during resource creation.
    Sends a 500 Internal Server Error response with an appropriate error message.
  */
  @ErrorHandler(CreationError)
  handleCreationError(
    error: CreationError,
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    reply.status(500).send({ message: error.message, code: error.statusCode });
  }

  /*
    Handles ServerError, triggered by any internal server errors.
    Sends a 500 Internal Server Error response with a detailed error message.
  */
  @ErrorHandler(ServerError)
  handleServerError(
    error: ServerError,
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    reply.status(500).send({ message: error.message, code: error.statusCode });
  }

  /*
    Handles NotFoundError, triggered when the requested resource is not found.
    Sends a 404 Not Found response with an appropriate error message.
  */
  @ErrorHandler(NotFoundError)
  handleNotFoundError(
    error: NotFoundError,
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    reply.status(404).send({ message: error.message, code: error.statusCode });
  }

  /*
    Handles DataValidationError, triggered when there is a validation error in the request data.
    Logs the error details and sends a 400 Bad Request response with validation error details.
  */
  @ErrorHandler(DataValidationError)
  handleDataValidationError(
    error: DataValidationError,
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    this.fastifyInstance.log.error(
      `DataValidationError: error ${error.message}`,
    ); // Log validation error details
    reply.status(400).send({
      message: error.message,
      code: error.statusCode,
      data: error?.data, // Optionally include additional data related to the error
    });
  }

  /*
    Handles schema validation errors, which occur when the request body does not match the expected schema.
    Logs the schema error details and sends a 400 Bad Request response.
  */
  @ErrorHandler(ERROR_CODES.FST_ERR_VALIDATION)
  handleSchemaValidationError(
    error: DataValidationError,
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    this.fastifyInstance.log.error(`schema: error ${error.message}`); // Log schema validation errors
    reply.status(400).send({ message: error.message, code: error.statusCode });
  }

  /*
    Handles all unhandled errors (general catch-all error handler).
    Logs the general error and sends a 500 Internal Server Error response.
    This ensures that no unhandled exceptions crash the server.
  */
  @ErrorHandler()
  generalErrorHandler(
    error: any,
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    this.fastifyInstance.log.error(`General Error: error ${error.message}`); // Log the general error details
    this.logger.error("General Error", error.stack); // Log the stack trace for debugging purposes
    reply.status(500).send({ message: error.message, code: error });
  }
}
