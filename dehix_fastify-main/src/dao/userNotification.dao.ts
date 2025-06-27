import { Service } from "fastify-decorators";
import { IUserNotification } from "../models/userNotification.entity";
import { v4 as uuidv4 } from "uuid";

@Service()
export class UserNotificationDAO {
  /**
   * Adds a new notification. (Firestore logic removed)
   * The timestamp is generated within the function.
   * @param notificationData - The notification data to add.
   * @returns The unique ID of the added notification.
   */
  async addNotification(notificationData: IUserNotification): Promise<string> {
    try {
      // Generate a unique ID for the notification
      const notificationId = uuidv4();

      // Prepare the data to be stored with a dynamically generated timestamp
      const data = {
        ...notificationData,
        timestamp: new Date().toISOString(),
      };

      // TODO: Save to MongoDB or another storage instead of Firestore
      // For now, just return the generated ID as a stub
      // You can implement MongoDB logic here if needed
      // Example: await NotificationModel.create(data);

      console.log(
        `notification (stub) added successfully with ID: ${notificationId}`,
      );
      return notificationId;
    } catch (error: any) {
      console.error("Error adding notification:", error);
      throw new Error(`Failed to add notification: ${error.message}`);
    }
  }
}
