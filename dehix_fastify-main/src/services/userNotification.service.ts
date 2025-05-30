import { Service, Inject } from "fastify-decorators";
import { BaseService } from "../common/base.service";
import { UserNotificationDAO } from "../dao/userNotification.dao";
import { IUserNotification } from "../models/userNotification.entity";

// DehixNotificationService class to interact with the database
@Service()
export class UserNotificationService extends BaseService {
  @Inject(UserNotificationDAO)
  private UserNotificationDAO!: UserNotificationDAO;

  /**
   * Creates a new notification.
   * @param notificationData - The notification data to create.
   * @returns The ID of the created notification.
   */
  async createNotification(
    notificationData: IUserNotification,
  ): Promise<string> {
    try {
      return await this.UserNotificationDAO.addNotification(notificationData);
    } catch (error: any) {
      throw new Error(
        `NotificationService -> Failed to create notification: ${error.message}`,
      );
    }
  }
}
