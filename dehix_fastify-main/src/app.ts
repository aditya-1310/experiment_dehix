import fastify from "fastify";
import fastifyEnv from "@fastify/env";
import { bootstrap } from "fastify-decorators";
import cors from "@fastify/cors";
import { initializeClients } from "./clients";
import swagger from "@fastify/swagger";
import swagger_ui from "@fastify/swagger-ui";
import { logger } from "./common/services/logger.service";
import fs from "fs";
import multipart from "@fastify/multipart";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Env schema
const schema = {
  type: "object",
  required: ["SERVER_PORT"],
  properties: {
    SERVER_PORT: { type: "string" },
    SERVER_HOST: { type: "string" },
    SERVER_MONGO_CONN: { type: "string" }
  },
  additionalProperties: true
};

const app = fastify({ 
  logger: logger,
  pluginTimeout: 60000 // increase to 60 seconds to allow fastifyDecorators to load controllers
});

// Env path for stages
const envPath = process.env.NODE_ENV
  ? `./.env.${process.env.NODE_ENV}`
  : "./.env";

const packageJSON = JSON.parse(fs.readFileSync("./package.json", "utf8"));

export const configure = async () => {
  try {
    // Register env first
    await app.register(fastifyEnv, {
      schema: schema,
      dotenv: { path: envPath },
      data: process.env,
    });

    await app.after();

    // Register multipart first as it's needed by other plugins
    await app.register(multipart, {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1 // Only allow 1 file per request
      },
      // attachFieldsToBody: true,
      throwFileSizeLimit: false
    });

    // Register swagger
    await app.register(swagger, {
      mode: "dynamic",
      swagger: {
        info: {
          title: packageJSON.title,
          description: packageJSON.description,
          version: packageJSON.version,
          contact: {
            name: packageJSON.author,
            url: packageJSON.website,
            email: packageJSON.email,
          },
        },
        schemes: ["http", "https"],
        consumes: ["application/json", "multipart/form-data"],
        produces: ["application/json"],
      },
      openapi: {
        info: {
          title: packageJSON.title,
          description: packageJSON.description,
          version: packageJSON.version,
          contact: {
            name: packageJSON.author,
            url: packageJSON.website,
            email: packageJSON.email,
          },
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "apiKey",
              name: "Authorization",
              in: "header",
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    });

    // Register swagger UI
    await app.register(swagger_ui, {
      routePrefix: "/documentation",
      uiConfig: {
        docExpansion: "none",
        deepLinking: true,
      },
      staticCSP: false,
      transformStaticCSP: (header) => header,
      transformSpecification: (swaggerObject) => swaggerObject,
      transformSpecificationClone: true,
    });

    // Register CORS
    await app.register(cors, {
      origin: ["*"],
      methods: ["OPTIONS", "GET", "PUT", "PATCH", "POST", "DELETE"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Accept",
        "Origin",
        "X-Requested-With",
        "x-api-key",
      ],
    });

    // Initialize clients (MongoDB, Firebase, etc)
    await app.register(initializeClients);

    // Register controllers last
    await app.register(bootstrap, {
      directory: join(__dirname, 'controllers'),
      mask: /\.controller\.(ts|js)$/,
      imports: true // Enable ES module imports
    });

    await app.ready();
    
    if (!global.LAMBDA_ENV) {
      const port = Number(app.config.SERVER_PORT) || 8080;
      await app.listen({ port });
      console.log(`Server listening on port ${port}`);
    }
  } catch (error) {
    console.error("Failed to configure application:", error);
    process.exit(1);
  }
};

if (!global.LAMBDA_ENV) {
  configure();
}

export default app;