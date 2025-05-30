import { Timestamp } from "@google-cloud/firestore";

// Enum for Notification Type
export enum UserNotificationTypeEnum {
  PROJECT_HIRING = "PROJECT_HIRING",
  SKILL_INTERVIEW = "SKILL_INTERVIEW",
  DOMAIN_INTERVIEW = "DOMAIN_INTERVIEW",
  TALENT_INTERVIEW = "TALENT_INTERVIEW",
  BID = "BID",
  INTERVIEW = "INTERVIEW",
  HIRE = "HIRE",
  VERIFICATION = "VERIFICATION",
  TICKET = "TICKET",
  TRANSACTION = "TRANSACTION",
  ADMIN = "ADMIN",
}

// TypeScript Interface for Firestore Document
export interface IUserNotification {
  id?: string;
  message: string;
  type: UserNotificationTypeEnum;
  entity: string;
  path: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  userId: string[];
}
