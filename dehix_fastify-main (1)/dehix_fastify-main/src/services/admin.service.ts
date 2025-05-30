import { Service, Inject } from "fastify-decorators";

import { BaseService } from "../common/base.service";
import { ConflictError, NotFoundError } from "../common/errors";
import { ERROR_CODES, RESPONSE_MESSAGE } from "../common/constants";
import { AdminDAO } from "../dao/admin.dao";
import { firebaseClient } from "../common/services";

@Service()
export class AdminsService extends BaseService {
  @Inject(AdminDAO)
  private AdminDAO!: AdminDAO;

  async create(body: any) {
    try {
      const admin_id = await firebaseClient.createFireBaseUserWithCustomClaims(
        body.email,
        body.password,
        { type: "admin" },
        body.userName,
      );
      body._id = admin_id;
      const admin: any = await this.AdminDAO.createAdmin(body);
      return admin;
    } catch (error: any) {
      if (body._id) {
        try {
          await firebaseClient.deleteFireBaseUser(body._id);
          this.logger.info(
            `Rolled back Firebase user creation for ID: ${body._id}`,
          );
        } catch (rollbackError) {
          this.logger.error(
            `Error rolling back Firebase user creation: ${rollbackError}`,
          );
        }
      }
      if (error.code === "USER_ALREADY_EXISTS") {
        throw new ConflictError(
          RESPONSE_MESSAGE.USER_EXISTS,
          ERROR_CODES.USER_ALREADY_EXIST,
        );
      } else {
        this.logger.error("Error in createFreelancer:", error);
        throw error; // Pass the error to the parent for proper handling
      }
    }
  }

  async getAdminByEmail(email: string) {
    const data: any = await this.AdminDAO.getAdminbyemail(email);

    if (data.length === 0) {
      return null;
    }
    return data;
  }

  async deleteAdminById(admin_id: string) {
    this.logger.info(
      `AdminsService: deleteAdminById: Deleting Admin for AdminId:${admin_id}`,
    );

    const checkAdmin = await this.AdminDAO.findAdminById(admin_id);
    if (!checkAdmin) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }
    const deleteAdmin = await this.AdminDAO.deleteAdminById(admin_id);

    return deleteAdmin;
  }

  async getAllAdmins(
    filters: Record<string, string[]>,
    page: string,
    limit: string,
  ) {
    this.logger.info("AdminsService: getAllAdmins: Fetching All Admins ");

    const admins: any = await this.AdminDAO.getAllAdmins(filters, page, limit);

    if (!admins) {
      this.logger.error("AdminsService: getAllAdmins: Admin not found ");
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Admin"),
        ERROR_CODES.ADMIN_NOT_FOUND,
      );
    }

    return admins;
  }

  async getAdminById(admin_id: string) {
    this.logger.info(
      `AdminsService: getAdminById: Fetching Admin for Admin ID:${admin_id}`,
    );

    const admin: any = await this.AdminDAO.findAdminById(admin_id);
    if (!admin) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.ADMIN_NOT_FOUND,
      );
    }

    return admin;
  }

  async updateAdminById(admin_id: string, body: any) {
    this.logger.info(
      `AdminService: updateAdminById: Updating Admin for ID:${admin_id}`,
    );

    const checkTransaction = await this.AdminDAO.findAdminById(admin_id);
    if (!checkTransaction) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }

    const data = await this.AdminDAO.updateAdmin(admin_id, body);

    return data;
  }
}
