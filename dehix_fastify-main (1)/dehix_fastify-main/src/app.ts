import fastify from "fastify";
import fastifyEnv from "@fastify/env";
import { bootstrap } from "fastify-decorators";
import cors from "@fastify/cors";
import { initializeClients } from "./clients";
import swagger from "@fastify/swagger";
import swagger_ui from "@fastify/swagger-ui";
import { logger } from "./common/services/logger.service";
import fs from "fs";
import fastifyMultipart from "fastify-multipart";

// Env schema
const schema = {
  type: "object",
  required: [],
  patternProperties: {
    "SERVER_(.*)": { type: "string" },
  },
  // add key properties for specific property validation
};

const app = fastify({ logger: logger });

// Env path for stages
const envPath = process.env.NODE_ENV
  ? `./.env.${process.env.NODE_ENV}`
  : "./.env";

const packageJSON = JSON.parse(fs.readFileSync("./package.json", "utf8"));

export const configure = async () => {
  // Register handlers auto-bootstrap
  app.register(fastifyEnv, {
    schema: schema,
    dotenv: { path: envPath },
    data: process.env,
  });

  await app.after();

  app
    .register(fastifyMultipart)
    .register(swagger, {
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
        // basePath: '',
        schemes: ["http", "https"],
        consumes: ["application/json"],
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
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    })
    .register(swagger_ui, {
      routePrefix: "/documentation",
      uiConfig: {
        docExpansion: "none",
        deepLinking: true,
      },
      staticCSP: false,
      transformStaticCSP: (header) => header,
      transformSpecification: (swaggerObject) => {
        return swaggerObject;
      },
      transformSpecificationClone: true,
    });

  app
    .register(cors, {
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
    })
    .register(initializeClients)
    .register(bootstrap, {
      // Specify directory with our controllers
      directory: new URL(`controllers`, import.meta.url),

      // Specify mask to match only our controllers
      mask: /\.controller\./,
    });

  try {
    await app.ready();
  } catch (error) {
    console.log("An error occurred during initialization:", error);
  }

  if (!global.LAMBDA_ENV) {
    console.log("Running App env");

    app.listen({ port: Number(process.env.SERVER_PORT) }, (err: any) => {
      if (err) console.error(err);
      console.log(`server listening on ${process.env.SERVER_PORT}`);
    });
  }
};

if (!global.LAMBDA_ENV) {
  configure();
}

export default app;
