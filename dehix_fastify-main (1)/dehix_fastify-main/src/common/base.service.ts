import {
  FastifyInstanceToken,
  FastifyReplyToken,
  FastifyRequestToken,
  Inject,
} from "fastify-decorators";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Logger } from "./services/logger.service";

// BaseService class provides base functionalities such as access to Fastify's request, reply, and logging utilities.
// This can be extended by other service classes to reuse common logic and dependencies.
export class BaseService {
  // Inject FastifyInstance to access server-related configurations and utilities like routes, plugins, etc.
  @Inject(FastifyInstanceToken)
  fastifyInstance!: FastifyInstance;

  // Inject FastifyRequest to access the current HTTP request.
  @Inject(FastifyRequestToken)
  request!: FastifyRequest;

  // Inject FastifyReply to access the current HTTP response, allowing for setting headers, status codes, and sending responses.
  @Inject(FastifyReplyToken)
  reply!: FastifyReply;

  // Inject a custom Logger service to log messages, errors, and other information for debugging and monitoring.
  @Inject(Logger)
  logger!: Logger;
}
