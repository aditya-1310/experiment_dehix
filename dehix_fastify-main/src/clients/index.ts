import { FastifyInstance } from "fastify";
// Remove incorrect import: import { firebaseClient } from "../common/services";
import { MongoClient } from "./mongo.client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const initializeClients = async (fastify: FastifyInstance) => {
  await MongoClient.init(fastify);
  // Firebase initialization removed - not needed
};

export * from "./mongo.client";
