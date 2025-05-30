/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  FastifyLoggerInstance,
  FastifyPluginAsync,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
  RawServerDefault,
} from "fastify";

declare module "fastify" {
  export interface FastifyRequest {
    em: EntityManager;
    metadata: { [key: string]: any };
    decodedToken: any;
    userId: string;
    file(): Promise<FastifyMultipartFile>;
  }

  export interface FastifyInstance<
    RawServer extends RawServerBase = RawServerDefault,
    RawRequest extends
      RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
    RawReply extends
      RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
    Logger = FastifyLoggerInstance,
  > {
    config: FastifyPluginAsync;
  }
}
