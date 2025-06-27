// import { firebaseClient } from "./firebase.service"; // Reuse the existing firebase client
import { logger } from "./logger.service";

// FirestoreClient is not needed for voice messages/media (S3-only flow)
// If you do not use Firestore for any other feature, you can remove this file entirely.
// If you use Firestore for other features, leave it as is for those features.

// class FirestoreClient {
//   private db!: FirebaseFirestore.Firestore;
//
//   constructor() {
//     logger.info("FirestoreClient -> Initializing Firestore client...");
//     this.init();
//   }
//
//   private init(): void {
//     try {
//       if (!firebaseClient.admin) {
//         throw new Error("Firebase client is not initialized.");
//       }
//       this.db = firebaseClient.admin.firestore();
//       logger.info("FirestoreClient -> Firestore client initialized.");
//     } catch (error) {
//       logger.error(
//         "FirestoreClient -> Error initializing Firestore client:",
//         error,
//       );
//       throw error;
//     }
//   }
//   ...
// }

// export const firestoreClient = new FirestoreClient();
