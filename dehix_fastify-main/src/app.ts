import fastify from "fastify";
import fastifyEnv from "@fastify/env";
import { bootstrap } from "fastify-decorators";
import cors from "@fastify/cors";
import { initializeClients } from "./clients";
import swagger from "@fastify/swagger";
import swagger_ui from "@fastify/swagger-ui";
import { logger } from "./common/services/logger.service";
import fs from "fs";
import path from "path"; // Added path
import fastifyMultipart from "fastify-multipart";
import fastifyStatic from "@fastify/static"; // Added fastify-static

// Env schema
const schema = {
  type: "object",
  required: ["SERVER_MONGO_CONN", "SERVER_PORT"], // Example, ensure these are actually required
  properties: {
    SERVER_MONGO_CONN: { type: "string" },
    SERVER_PORT: { type: "number" },
    GOOGLE_APPLICATION_CREDENTIALS: { type: "string" }, // For Firebase Admin
    FIREBASE_PROJECT_ID: { type: "string" }, // For Firebase Admin
    BACKEND_PUBLIC_URL: { type: "string" }, // For constructing full file URLs
    // Add other SERVER_ prefixed vars if they are fixed and known
  },
  patternProperties: {
    "SERVER_(.*)": { type: "string" }, // Ensure this is active for other SERVER_ variables
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
    .register(fastifyStatic, {
      // Added for serving uploaded files
      root: path.join(__dirname, "..", "uploads"), // Path to the uploads folder
      prefix: "/uploads/", // Optional: prefix for the URL
      decorateReply: true, // Decorate reply with `sendFile` and `download`
      setHeaders: (res, _pathName, _stat) => {
        // Prefixed unused parameters
        // Optional: set custom headers
        res.setHeader("Access-Control-Allow-Origin", "*");
      },
    })
    .register(fastifyMultipart, {
      limits: {
        fieldNameSize: 100, // Max field name size in bytes
        fieldSize: 100, // Max field value size in bytes
        fields: 10, // Max number of non-file fields
        fileSize: 10 * 1024 * 1024, // Max file size in bytes (10MB)
        files: 1, // Max number of file fields
        headerPairs: 2000, // Max number of header key=>value pairs
      },
      attachFieldsToBody: true,
      onFile: (part) => {
        console.log("Processing file:", {
          filename: part.filename,
          encoding: part.encoding,
          mimetype: part.mimetype,
          fieldname: part.fieldname,
        });
      },
      throwFileSizeLimit: true,
    })
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
