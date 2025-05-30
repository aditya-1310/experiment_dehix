import { Service } from "fastify-decorators";
import { Model } from "mongoose";
import { BaseDAO } from "../common/base.dao";
import crypto from "crypto";
import { createHash } from "crypto"; // Import the crypto module
import {
  AdminModel,
  IAdmin,
  AdminStatus,
  AdminType,
  PasswordStatus,
} from "../models/admin.entity";
import { fetchDataWithQueries } from "../common/utils";

@Service()
export class AdminDAO extends BaseDAO {
  model: Model<IAdmin>;

  constructor() {
    super();
    this.model = AdminModel;
  }
  private hashPassword(password: string): string {
    return createHash("sha256").update(password).digest("hex");
  }
  // Method to find an admin by ID
  async findAdminById(id: string): Promise<IAdmin | null> {
    try {
      const admin = await this.model.findById(id);
      if (!admin) {
        throw new Error(`Admin with ID ${id} not found`);
      }
      return admin;
    } catch (error: any) {
      throw new Error(`Failed to fetch admin: ${error.message}`);
    }
  }

  // Method to create a new admin
  async createAdmin(data: {
    _id: string;
    profilePic: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    phone?: string;
    status?: AdminStatus;
    type?: AdminType;
  }): Promise<IAdmin> {
    try {
      // Set defaults for status and type if not provided
      data.status = data.status || AdminStatus.PENDING;
      data.type = data.type || AdminType.ADMIN;
      data.password = this.hashPassword(data.password);
      const admin = await this.model.create(data);
      return admin;
    } catch (error: any) {
      throw new Error(`Failed to create admin: ${error.message}`);
    }
  }

  // Method to delete an admin by ID
  async getAdminbyemail(email: string) {
    try {
      const query = {
        ...(email && { email }),
      };
      const Data = await this.model.find(query);
      return Data;
    } catch (error: any) {
      throw new Error(`Failed to fetch admin data: ${error.message}`);
    }
  }

  async deleteAdminById(admin_id: string): Promise<IAdmin | null> {
    try {
      const admin = await this.model.findByIdAndDelete(admin_id);
      if (!admin) {
        throw new Error(`Admin with ID ${admin_id} not found`);
      }
      return admin;
    } catch (error: any) {
      throw new Error(`Failed to delete admin: ${error.message}`);
    }
  }
  async getAdminbyusername(username: string) {
    try {
      const query = {
        ...(username && { username }),
      };
      const Data = await this.model.find(query);
      return Data;
    } catch (error: any) {
      throw new Error(`Failed to fetch admin data: ${error.message}`);
    }
  }

  async updateAdmin(admin_id: string, update: any): Promise<IAdmin | null> {
    try {
      // Check if the update includes a new username
      if (update.username) {
        // Query the database to check if the username already exists
        const existingAdmins = await this.getAdminbyusername(update.username);

        if (
          existingAdmins.length > 0 &&
          existingAdmins[0]._id.toString() !== admin_id
        ) {
          // Username is taken by another admin
          throw new Error(
            `The username '${update.username}' is already taken.`,
          );
        }
      }
      if (update.password) {
        // Encode the password using SHA-256
        const hashedPassword = crypto
          .createHash("sha256")
          .update(update.password)
          .digest("hex");

        // Replace the plain password with the hashed one
        update.password = hashedPassword;
      }
      if (update.resetRequest === true) {
        // Add a new password change request with status PENDING
        update.$push = {
          changePasswordRequests: {
            requestedAt: new Date(),
            passwordStatus: PasswordStatus.PENDING,
          },
        };
      }

      // Proceed with updating the admin
      const admin = await this.model.findByIdAndUpdate(
        { _id: admin_id },
        update,
        { new: true },
      );

      if (!admin) {
        throw new Error(`Admin with ID ${admin_id} not found.`);
      }

      return admin;
    } catch (error: any) {
      throw new Error(`Failed to update admin: ${error.message}`);
    }
  }

  // Method to get all admins
  async getAllAdmins(
    filters: Record<string, string[]>,
    page: string,
    limit: string,
  ): Promise<IAdmin[]> {
    try {
      return await fetchDataWithQueries(this.model, filters, page, limit);
    } catch (error: any) {
      throw new Error(`Failed to fetch admins: ${error.message}`);
    }
  }

  // Method to find the most verified admin
  async findOracle(): Promise<{ id: string; username: string } | null> {
    try {
      const admin = await this.model
        .aggregate([
          {
            $lookup: {
              from: "verifications",
              localField: "_id",
              foreignField: "verifier_id",
              as: "verifications",
            },
          },
          {
            $project: {
              _id: 1,
              userName: 1,
              verificationCount: { $size: "$verifications" },
            },
          },
          {
            $sort: {
              verificationCount: -1, // Sort in descending order to get the most verified
            },
          },
          {
            $limit: 1,
          },
        ])
        .exec();

      if (!admin || admin.length === 0) {
        throw new Error("No admin found");
      }

      // Return the admin object with id and username
      return {
        id: admin[0]._id,
        username: admin[0].userName,
      };
    } catch (error: any) {
      console.error("Error finding admin for verification:", error);
      throw new Error(`Failed to find admin: ${error.message}`);
    }
  }
}
