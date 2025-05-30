import { firebaseClient } from "./firebase.service"; // Reuse the existing firebase client
import { logger } from "./logger.service";

class FirestoreClient {
  private db!: FirebaseFirestore.Firestore;

  constructor() {
    logger.info("FirestoreClient -> Initializing Firestore client...");
    this.init();
  }

  /**
   * Initializes the Firestore client using the Firebase app from firebaseClient.
   */
  private init(): void {
    try {
      if (!firebaseClient.admin) {
        throw new Error("Firebase client is not initialized.");
      }

      this.db = firebaseClient.admin.firestore();
      logger.info("FirestoreClient -> Firestore client initialized.");
    } catch (error) {
      logger.error(
        "FirestoreClient -> Error initializing Firestore client:",
        error,
      );
      throw error;
    }
  }

  /**
   * Sets data to a Firestore document with a specified ID.
   * If the document already exists, it will be overwritten.
   * @param collectionName - Name of the Firestore collection.
   * @param documentId - ID of the document to set.
   * @param data - Data to set in the document.
   * @returns A success message upon completion.
   */
  async setData(
    collectionName: string,
    documentId: string,
    data: Record<string, any>,
  ): Promise<string> {
    try {
      logger.info(
        `FirestoreClient -> Setting data in collection: ${collectionName}, ID: ${documentId}`,
      );

      // Special case for "conversations" collection to auto-detect chat type
      if (collectionName === "conversations") {
        if (!data.participants || !Array.isArray(data.participants)) {
          throw new Error("Invalid participants field. Must be an array.");
        }

        const chatType = data.participants.length === 2 ? "private" : "group";
        data.type = chatType; // Ensure correct type before saving
      }

      await this.db.collection(collectionName).doc(documentId).set(data);
      logger.info(
        `FirestoreClient -> Document set successfully: ${documentId}`,
      );
      return `Document ${documentId} set successfully.`;
    } catch (error: any) {
      logger.error("FirestoreClient -> Error setting data:", error);
      throw new Error(`Failed to set data: ${error.message}`);
    }
  }

  /**
   * Updates an existing document in the specified Firestore collection.
   * @param collectionName - Name of the Firestore collection.
   * @param documentId - ID of the document to be updated.
   * @param data - Data to update in the document.
   * @returns A success message upon completion.
   */
  async updateData(
    collectionName: string,
    documentId: string,
    data: Record<string, any>,
  ): Promise<string> {
    try {
      logger.info(
        `FirestoreClient -> Updating document in collection: ${collectionName}, ID: ${documentId}`,
      );

      // Ensure correct chat type on update if updating "participants"
      if (collectionName === "conversations" && data.participants) {
        if (!Array.isArray(data.participants)) {
          throw new Error("Invalid participants field. Must be an array.");
        }

        const chatType = data.participants.length === 2 ? "private" : "group";
        data.type = chatType; // Auto-correct type
      }

      await this.db.collection(collectionName).doc(documentId).update(data);
      logger.info(
        `FirestoreClient -> Document updated successfully: ${documentId}`,
      );
      return `Document ${documentId} updated successfully.`;
    } catch (error: any) {
      logger.error("FirestoreClient -> Error updating data:", error);
      throw new Error(`Failed to update data: ${error.message}`);
    }
  }

  /**
   * Fetches a document by ID from the specified Firestore collection.
   * @param collectionName - Name of the Firestore collection.
   * @param documentId - ID of the document to fetch.
   * @returns The document data if it exists.
   */
  async getData(collectionName: string, documentId: string): Promise<any> {
    try {
      logger.info(
        `FirestoreClient -> Fetching document from collection: ${collectionName}, ID: ${documentId}`,
      );
      const doc = await this.db
        .collection(collectionName)
        .doc(documentId)
        .get();

      if (!doc.exists) {
        throw new Error(`Document ${documentId} does not exist.`);
      }

      logger.info(
        `FirestoreClient -> Document fetched successfully: ${documentId}`,
      );
      return doc.data();
    } catch (error: any) {
      logger.error("FirestoreClient -> Error fetching data:", error);
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }

  /**
   * Deletes a document from the specified Firestore collection.
   * @param collectionName - Name of the Firestore collection.
   * @param documentId - ID of the document to delete.
   * @returns A success message upon completion.
   */
  async deleteData(
    collectionName: string,
    documentId: string,
  ): Promise<string> {
    try {
      logger.info(
        `FirestoreClient -> Deleting document from collection: ${collectionName}, ID: ${documentId}`,
      );
      await this.db.collection(collectionName).doc(documentId).delete();
      logger.info(
        `FirestoreClient -> Document deleted successfully: ${documentId}`,
      );
      return `Document ${documentId} deleted successfully.`;
    } catch (error: any) {
      logger.error("FirestoreClient -> Error deleting data:", error);
      throw new Error(`Failed to delete data: ${error.message}`);
    }
  }
}

export const firestoreClient = new FirestoreClient();
