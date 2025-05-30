import { Service } from "fastify-decorators";
import { IUserNotification } from "../models/userNotification.entity";
import { firestoreClient } from "../common/services/firestore.service";
import { v4 as uuidv4 } from "uuid";

@Service()
export class UserNotificationDAO {
  /**
   * Adds a new notification to the Firestore 'notification' collection.
   * The timestamp is generated within the function.
   * @param notificationData - The notification data to add.
   * @returns The unique ID of the added conversation.
   */
  async addNotification(notificationData: IUserNotification): Promise<string> {
    try {
      // Generate a unique ID for the notification
      const notificationId = uuidv4();

      // Prepare the data to be stored with a dynamically generated timestamp
      const data = {
        // id: notificationId,
        ...notificationData,
        timestamp: new Date().toISOString(),
      };

      // Use the Firestore client to add the data
      const addedNotificationId = await firestoreClient.setData(
        "notifications",
        notificationId,
        data,
      );

      console.log(
        `notification added successfully with ID: ${addedNotificationId}`,
      );
      return addedNotificationId;
    } catch (error: any) {
      console.error("Error adding notification:", error);
      throw new Error(`Failed to add notification: ${error.message}`);
    }
  }
}
