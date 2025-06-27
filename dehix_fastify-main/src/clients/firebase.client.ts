import * as admin from "firebase-admin";
import { FastifyInstance } from "fastify";
import { logger } from "../common/services/logger.service";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FirebaseClient {
  let firestoreInstance: admin.firestore.Firestore | null = null;

  export async function init(fastify: FastifyInstance): Promise<void> {
    try {
      const serviceAccountPath = fastify.config.GOOGLE_APPLICATION_CREDENTIALS;
      const firebaseProjectId = fastify.config.FIREBASE_PROJECT_ID;

      if (!serviceAccountPath) {
        logger.warn("GOOGLE_APPLICATION_CREDENTIALS environment variable is not set. Firebase functionality will be disabled.");
        return;
      }

      if (!firebaseProjectId) {
        logger.warn("FIREBASE_PROJECT_ID environment variable is not set. Using default project from credentials.");
      }

      if (admin.apps.length === 0) {
        const config: admin.AppOptions = {
          credential: admin.credential.applicationDefault(),
        };
        
        if (firebaseProjectId) {
          config.projectId = firebaseProjectId;
        }

        admin.initializeApp(config);
        logger.info("Firebase Admin SDK initialized successfully.");
      } else {
        logger.info("Firebase Admin SDK already initialized.");
      }

      firestoreInstance = admin.firestore();
      fastify.decorate("firestore", firestoreInstance);
      logger.info("Firestore instance decorated to Fastify.");
    } catch (error) {
      logger.error("Failed to initialize Firebase Admin SDK:", error);
      if (error instanceof Error && error.message.includes('GOOGLE_APPLICATION_CREDENTIALS')) {
        logger.error("Please ensure GOOGLE_APPLICATION_CREDENTIALS points to a valid service account key file.");
      }
      // Don't throw - let the application continue without Firebase if it fails
    }
  }

  export function getFirestore(): admin.firestore.Firestore {
    if (!firestoreInstance) {
      const error = new Error(
        "Firebase Admin SDK (Firestore) is not initialized. Ensure GOOGLE_APPLICATION_CREDENTIALS is set and points to a valid service account key file."
      );
      logger.error(error);
      throw error;
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
