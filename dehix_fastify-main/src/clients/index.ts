import { FastifyInstance } from "fastify";
// Remove incorrect import: import { firebaseClient } from "../common/services";
import { MongoClient } from "./mongo.client";
import { FirebaseClient } from "./firebase.client"; // Import the new FirebaseAdmin client

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const initializeClients = async (fastify: FastifyInstance) => {
  await MongoClient.init(fastify);
  // Initialize Firebase Admin SDK
  await FirebaseClient.init(fastify);
};

export * from "./mongo.client";
export * from "./firebase.client"; // Optionally export if needed elsewhere directly
