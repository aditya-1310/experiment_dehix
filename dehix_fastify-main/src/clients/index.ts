import { FastifyInstance } from "fastify";
// Remove incorrect import: import { firebaseClient } from "../common/services";
import { MongoClient } from "./mongo.client";
import { firebaseClient } from "../common/services/firebase.service";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const initializeClients = async (fastify: FastifyInstance) => {
  await MongoClient.init(fastify);
  // Initialize Firebase Admin SDK (required for authentication & other services)
  try {
    await firebaseClient.init();
    fastify.log.info("Firebase Admin initialized successfully");
  } catch (err) {
    fastify.log.error({ err }, "Failed to initialize Firebase Admin SDK");
    throw err;
  }
};

export * from "./mongo.client";
