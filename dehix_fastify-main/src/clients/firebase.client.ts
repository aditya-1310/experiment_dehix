import * as admin from "firebase-admin";
import { FastifyInstance } from "fastify";
import { logger } from "../common/services/logger.service";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FirebaseClient {
  let firestoreInstance: admin.firestore.Firestore | null = null;

  export async function init(fastify: FastifyInstance): Promise<void> {
    try {
      const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      const firebaseProjectId = process.env.FIREBASE_PROJECT_ID; // Good to have for verification or specific config

      if (!serviceAccountPath) {
        logger.warn(
          "GOOGLE_APPLICATION_CREDENTIALS environment variable is not set. Firebase Admin SDK will not be initialized.",
        );
        logger.warn(
          "Firestore functionality in the backend (e.g., writing voice messages to chat) will be disabled.",
        );
        return;
      }
      if (!firebaseProjectId) {
        logger.warn("FIREBASE_PROJECT_ID environment variable is not set.");
      }

      // Check if already initialized to prevent re-initialization errors
      if (admin.apps.length === 0) {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(), // Uses GOOGLE_APPLICATION_CREDENTIALS
          // databaseURL: `https://${firebaseProjectId}.firebaseio.com` // Optional: if using Realtime Database
          // storageBucket: `${firebaseProjectId}.appspot.com` // Optional: if using Firebase Storage via Admin SDK
        });
        logger.info("Firebase Admin SDK initialized successfully.");
      } else {
        logger.info("Firebase Admin SDK already initialized.");
      }

      firestoreInstance = admin.firestore();
      fastify.decorate("firestore", firestoreInstance);
      logger.info("Firestore instance decorated to Fastify.");
    } catch (error) {
      logger.error("Failed to initialize Firebase Admin SDK:", error);
      // Depending on requirements, you might want to throw this error
      // to prevent the application from starting if Firebase is critical.
    }
  }

  export function getFirestore(): admin.firestore.Firestore {
    if (!firestoreInstance) {
      // This case should ideally not happen if init() is called correctly at startup.
      // And if GOOGLE_APPLICATION_CREDENTIALS is not set, init() returns early.
      logger.error(
        "Firestore accessed before initialization or initialization failed and GOOGLE_APPLICATION_CREDENTIALS was set.",
      );
      throw new Error(
        "Firebase Admin SDK (Firestore) is not initialized. Ensure GOOGLE_APPLICATION_CREDENTIALS is set and init() was successful.",
      );
    }
    return firestoreInstance;
  }
}

// Export a top-level function to get Firestore easily in services after decoration
// export const getFirestoreInstance = (): admin.firestore.Firestore => {
//   if (!FirebaseClient.firestoreInstance) { // This direct access is not ideal, better to use decorated instance from Fastify
//     throw new Error('Firestore instance not available. Was FirebaseClient.init called?');
//   }
//   return FirebaseClient.firestoreInstance;
// };
