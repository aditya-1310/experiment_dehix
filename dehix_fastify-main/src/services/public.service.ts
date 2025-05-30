import { Service, Inject } from "fastify-decorators";

import { BaseService } from "../common/base.service";

import { FreelancerDAO } from "../dao/freelancer.dao";
import { businessDAO } from "../dao/business.dao";
import { AdminDAO } from "../dao/admin.dao";

@Service()
export class PublicService extends BaseService {
  @Inject(FreelancerDAO)
  private FreelancerDAO!: FreelancerDAO;
  @Inject(businessDAO)
  private BusinessDAO!: businessDAO;
  @Inject(AdminDAO)
  private AdminDAO!: AdminDAO;

  async getUserByEmail(email: string) {
    try {
      const business = await this.BusinessDAO.getBusinessByEmail(email);
      if (business) {
        return {
          _id: business._id,
          userName: business.companyName,
          email: business.email,
          profilePic: business.profilePic,
          phone: business.phone,
          phoneVerify: business?.phoneVerify,
        };
      }

      const freelancer = await this.FreelancerDAO.getFreelancerByEmail(email);
      if (freelancer) {
        return {
          _id: freelancer._id,
          userName: freelancer.userName,
          email: freelancer.email,
          profilePic: freelancer.profilePic,
          phone: freelancer.phone,
          phoneVerify: freelancer?.phoneVerify,
        };
      }
      return { email, error: "User not found" };
    } catch (error: any) {
      this.logger.error("Error finding user by email:", error);
      throw new Error("Internal server error");
    }
  }

  async getUserbyUserId(users: string[]) {
    const result: any[] = [];

    for (const user of users) {
      try {
        const business = await this.BusinessDAO.findBusinessById(user);
        if (business) {
          result.push({
            _id: business._id,
            userName: business.companyName,
            email: business.email,
            profilePic: business.profilePic,
            phoneVerify: business?.phoneVerify,
          });
          continue;
        }
        const freelancer = await this.FreelancerDAO.findFreelancerById(user);
        if (freelancer) {
          result.push({
            _id: freelancer._id,
            userName: freelancer.userName,
            email: freelancer.email,
            profilePic: freelancer.profilePic,
            phoneVerify: freelancer?.phoneVerify,
          });
          continue;
        }
        const admin = await this.AdminDAO.findAdminById(user);
        if (admin) {
          result.push({
            _id: admin._id,
            userName: admin.userName,
            email: admin.email,
          });
          continue;
        }
        result.push({ user, error: "User not found" });
      } catch (error: any) {
        this.logger.error("Error finding user by id:", error);
      }
    }
    return result;
  }

  async getUserByUserName(userName: string[]) {
    this.logger.info(
      `PublicService: getUserByUserName: Fetching User for User Name: ${userName}`,
    );
    const result: any[] = [];

    for (const user of userName) {
      try {
        const business = await this.BusinessDAO.getBusinessByCompanyName(user);
        if (business && business.length > 0) {
          result.push(business);
          continue;
        }
        const freelancer =
          await this.FreelancerDAO.getFreelancerByUserName(user);
        if (freelancer) {
          result.push(freelancer);
          continue;
        }
      } catch (error: any) {
        this.logger.error("Error finding user by user name:", error);
      }
    }
    return result;
  }

  async patchUserConnects(
    userId: string,
    isFreelancer: boolean | null,
    isBusiness: boolean | null,
  ) {
    this.logger.info(`PublicService: patchUserConnects: ${userId}`);

    if (isFreelancer) {
      await this.FreelancerDAO.addConnect(userId);
    } else if (isBusiness) {
      await this.BusinessDAO.addConnect(userId);
    }
  }

  async checkDuplicateUserName(
    username: string,
    is_freelancer: boolean | null,
    is_business: boolean | null,
  ) {
    this.logger.info(`PublicService: checkDuplicateUserName: ${username}`);

    if (is_freelancer) {
      return await this.FreelancerDAO.checkDuplicateUserName(username);
    } else if (is_business) {
      return await this.BusinessDAO.checkDuplicateCompanyName(username);
    }
  }
}
