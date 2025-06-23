/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  FastifyLoggerInstance,
  // FastifyPluginAsync, // Removed as it's no longer used
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
  RawServerDefault,
} from "fastify";
import { MultipartFile } from "fastify-multipart"; // Added import
import { AppConfig } from "./config"; // Added import

declare module "fastify" {
  export interface FastifyRequest {
    em: EntityManager;
    metadata: { [key: string]: any };
    decodedToken: any;
    userId: string;
    file(): Promise<MultipartFile>; // Corrected type from fastify-multipart
    isMultipart(): boolean; // Added for fastify-multipart
  }

  export interface FastifyInstance<
    RawServer extends RawServerBase = RawServerDefault,
    RawRequest extends
      RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
    RawReply extends
      RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
    Logger = FastifyLoggerInstance,
  > {
    config: AppConfig; // Changed from FastifyPluginAsync
  }
}

// Import AppConfig at the top of the file or ensure it's globally available
// For now, assuming it will be resolved by TypeScript if in the same `types` folder or tsconfig paths.
// Better to add:
import { AppConfig } from "./config";
