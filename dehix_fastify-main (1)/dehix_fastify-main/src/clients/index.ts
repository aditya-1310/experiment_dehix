import { FastifyInstance } from "fastify";
import { firebaseClient } from "../common/services";
import { MongoClient } from "./mongo.client";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const initializeClients = async (fastify: FastifyInstance) => {
  await MongoClient.init(fastify);
  await firebaseClient.init();
};

export * from "./mongo.client";
