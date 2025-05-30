import admin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";

// import { SECRETNAMES } from "../constants/secret-manager.constant";
// import serviceAccount from '../../../config/test-service-account.json' assert { type: 'json' };
import { ERROR_CODES } from "../constants";
import { logger } from "./logger.service";
interface FirebaseUserProperties {
  email?: string;
  phoneNumber?: string;
  displayName?: string;
  photoURL?: string;
  disabled?: boolean;
}
class FirebaseClient {
  admin!: admin.app.App;

  constructor() {
    logger.info(
      "FirebaseClient-> constructor ->initializing firebase admin : ",
    );
  }

  async init() {
    const dirName = path.dirname(new URL(import.meta.url).pathname);
    const serviceAccountPath = path
      .join(dirName, `../../common/config/firebase-dev.json`)
      .replace(/^\\([A-Za-z]:)/, "$1");
    const serviceAccount = JSON.parse(
      fs.readFileSync(serviceAccountPath, "utf8"),
    );

    this.admin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  }

  /**
   * method to create firebase user
   * @param emailAddress
   * @returns
   */
  async createUserByEmail(
    emailAddress: string,
    password: string,
    displayName: string,
    phoneNumber?: string,
  ): Promise<any> {
    try {
      const userRecord = await this.admin.auth().createUser({
        email: emailAddress,
        password: password,
        emailVerified: true,
        displayName: displayName,
        phoneNumber: phoneNumber,
      });
      const reset_link = await this.sendPasswordResetLink(emailAddress);
      return [userRecord.uid, reset_link];
    } catch (error) {
      throw new Error(
        `FirebaseClient-> createFireBaseUser ->Error creating user: ${error}`,
      );
    }
  }

  /**
   * method to set custom claims
   * @param uid
   * @param customClaims
   */
  async setCustomClaims(
    uid: string,
    customClaims: { [key: string]: any },
  ): Promise<void> {
    try {
      await this.admin.auth().setCustomUserClaims(uid, customClaims);
    } catch (error) {
      throw new Error(
        `FirebaseClient-> setCustomClaims ->Error creating user: ${error}`,
      );
    }
  }

  /**
   * method to generate a custom token for a user
   * @param uid
   * @returns
   */
  async generateCustomToken(uid: string): Promise<string> {
    try {
      logger.info(
        "FirebaseClient-> generateCustomToken ->creating custom token:",
      );
      const customToken = await admin.auth().createCustomToken(uid);
      return customToken;
    } catch (error) {
      logger.error(
        "FirebaseClient-> generateCustomToken ->Error generating custom token:",
        error,
      );
      throw new Error(ERROR_CODES.CUSTOM_TOKEN_GENERATION_FAILED);
    }
  }

  /**
   * method to check if firebase user exist
   * @param uid
   * @returns
   */
  async checkUserExists(uid: string): Promise<boolean> {
    try {
      logger.info(
        "FirebaseClient->checkUserExists-> checking if firebase user exist :",
        uid,
      );
      const user = await admin.auth().getUser(uid);

      return !!user; // Return true if user exists, false otherwise
    } catch (error) {
      logger.error("FirebaseClient-> checkUserExists ->Error :", error);
      // Other error occurred, throw it for handling
      return false;
    }
  }

  /**
   * method to create firebase user with custom claims
   * @param email
   * @param phoneNumber
   * @param customClaims
   * @returns
   */
  async createFireBaseUserWithCustomClaims(
    email: string,
    password: string,
    customClaims: { [key: string]: any },
    displayName: string,
    phoneNumber?: string,
  ): Promise<string> {
    try {
      logger.info(
        `FirebaseClient-> createFireBaseUserWithCustomClaims -> creating firebase user:`,
        customClaims,
      );
      const [userId, _] = await this.createUserByEmail(
        email,
        password,
        displayName,
        phoneNumber,
      );
      await this.setCustomClaims(userId, customClaims);
      return userId;
    } catch (error: any) {
      if (
        error.message.includes(
          "The email address is already in use by another account",
        )
      ) {
        logger.error(
          `FirebaseClient-> createFireBaseUserWithCustomClaims -> User already exists: ${error.message}`,
        );
        const customError = new Error("User already exists");
        throw customError;
      } else {
        logger.error(
          `FirebaseClient-> createFireBaseUserWithCustomClaims -> Error creating user: ${error}`,
        );
        throw error;
      }
    }
  }

  /**
   * method to delete firebase user
   * @param userId
   */
  async deleteFireBaseUser(userId: string) {
    try {
      await this.admin.auth().deleteUser(userId);
    } catch (error) {
      logger.error(
        `FirebaseClient-> createFireBaseUserWithCustomClaims ->Error creating user: ${error}`,
      );
      throw error;
    }
  }

  /**
   * Decodes a Firebase token and returns the decoded data along with custom claims.
   * @param {string} token - The Firebase token to decode.
   * @returns {Promise<decodedToken: object>} - Resolves with the decoded token data and custom claims.
   */
  async getDecodedFirebaseToken(token: string) {
    try {
      logger.info(
        "`FirebaseClient-> getDecodedFirebaseToken -> decoding Firebase token",
      );
      return await admin.auth().verifyIdToken(token);
    } catch (error) {
      logger.error(
        "`FirebaseClient-> getDecodedFirebaseToken -> Error decoding Firebase token:",
        error,
      );
      throw error;
    }
  }

  /**
   * Method to send a password reset email
   * @param email
   * @returns {Promise<void>}
   */
  async sendPasswordResetLink(email: string): Promise<any> {
    try {
      const resetLink = await this.admin
        .auth()
        .generatePasswordResetLink(email);
      return resetLink;
    } catch (error: any) {
      logger.error(
        `FirebaseClient-> sendPasswordResetEmail ->Error: ${error.message}`,
      );
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }
  }

  /**
   * Method to update the firebase user email and phone number
   * @param userId
   * @param emailAddress
   * @param phoneNumber
   * @returns
   */
  async updateUser(
    userId: string,
    properties: FirebaseUserProperties,
  ): Promise<string> {
    try {
      // Call Firebase Admin SDK to update the user
      const userRecord = await this.admin.auth().updateUser(userId, properties);
      return userRecord.uid; // Return the UID of the updated user
    } catch (error) {
      // Throw an error if updating the user fails
      throw new Error(
        `FirebaseClient-> updateUser -> Error updating user: ${error}`,
      );
    }
  }
}

export const firebaseClient = new FirebaseClient();
