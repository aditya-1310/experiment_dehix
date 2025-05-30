import { Service, Inject } from "fastify-decorators";
import { BaseService } from "../common/base.service";
import { BidDAO, businessDAO, FreelancerDAO } from "../dao";
import { firebaseClient } from "../common/services";
import { ConflictError, NotFoundError } from "../common/errors";
import { ERROR_CODES, RESPONSE_MESSAGE } from "../common/constants";
import { ProjectDAO } from "../dao/project.dao";
import { VerificationService } from "./verifications.service";
import { IProject, StatusEnum } from "../models/project.entity";
import { PutBusinessBody } from "../types/v1/business/updateBusiness";
import {
  BusinessStatusEnum,
  KycBusinessStatusEnum,
} from "../models/business.entity";
import { generateReferralCode } from "../common/utils";

@Service()
export class BusinessService extends BaseService {
  @Inject(businessDAO)
  private businessDao!: businessDAO;
  @Inject(ProjectDAO)
  private ProjectDAO!: ProjectDAO;
  @Inject(VerificationService)
  private VerificationService!: VerificationService;
  @Inject(FreelancerDAO)
  private FreelancerDAO!: FreelancerDAO;
  @Inject(BidDAO)
  private BidDAO!: BidDAO;

  async createBusiness(business: any, referralCode?: string | null) {
    try {
      this.logger.info("Business Service: creating business profile");

      let referrer: any = null;
      if (referralCode != null) {
        referrer =
          await this.businessDao.getBusinessByReferralCode(referralCode);
        if (!referrer) {
          this.logger.error(
            "FreelancerService: createFreelancerProfile: Referrer not found with Referral Code: ",
            referralCode,
          );
          throw new Error("Invalid referral code.");
        }
      }

      const business_id =
        await firebaseClient.createFireBaseUserWithCustomClaims(
          business.email,
          business.password,
          { type: "business" },
          business.companyName,
          business.phone,
        );
      business._id = business_id;

      if (!business.referral) {
        business.referral = {};
      }

      business.referral.referralCode = await generateReferralCode(
        business.userName,
      );

      const userObj = { ...business, password: "" };
      const data: any = await this.businessDao.createBusiness(userObj);

      // Request for profile verification
      await this.VerificationService.requestBusinessVerification(
        business_id,
        "business",
      );

      if (referrer) {
        await this.businessDao.addReferralBonus(referrer._id, business._id);
        this.logger.info(
          `FreelancerService: createFreelancerProfile: Referral bonus added for Referrer ID: ${referrer._id} and Referee ID: ${business._id}`,
        );
      }

      return data;
    } catch (error: any) {
      if (business._id) {
        try {
          await firebaseClient.deleteFireBaseUser(business._id);
          this.logger.info(
            `Rolled back Firebase user creation for ID: ${business._id}`,
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
        this.logger.error("Error in createBusiness:", error);
        throw error; // Pass the error to the parent for proper handling
      }
    }
  }

  async getFreelancersByProjectId(projectId: string): Promise<any> {
    try {
      this.logger.info(
        `BusinessService -> getFreelancersByProjectId -> Fetching freelancers for projectId: ${projectId}`,
      );

      const freelancers =
        await this.ProjectDAO.getFreelancersByProjectId(projectId);

      if (!freelancers || freelancers.length === 0) {
        this.logger.warn(`No freelancers found for projectId: ${projectId}`);
        return {
          message: `No freelancers found for projectId: ${projectId}`,
          freelancers: [],
        };
      }

      return {
        message: "Freelancers fetched successfully",
        freelancers,
      };
    } catch (error: any) {
      this.logger.error(`Error in getFreelancersByProjectId: ${error.message}`);
      throw new Error(
        `Unable to fetch freelancers for projectId: ${projectId}`,
      );
    }
  }

  async updateBusiness(business_id: string, update: PutBusinessBody) {
    this.logger.info(
      `Business Service: business id:${business_id}
        updating business profile`,
    );
    // If a profile picture is provided, update the avatar_url in Firebase
    if (update.profilePic) {
      try {
        // Call the updateUser function to update the avatar_url in Firebase
        await firebaseClient.updateUser(business_id, {
          photoURL: update.profilePic, // Assuming the profilePic is the URL of the image
        });
        this.logger.info(
          "Updated avatar_url in Firebase for freelancer: ",
          business_id,
        );
      } catch (error) {
        this.logger.error("Error updating avatar_url in Firebase:", error);
        throw new Error("Error updating avatar in Firebase.");
      }
    }

    // If phone number is provided, update the phoneNumber in Firebase
    if (update.phone) {
      try {
        // Call the updateUser function to update the phoneNumber in Firebase
        await firebaseClient.updateUser(business_id, {
          phoneNumber: update.phone,
        });
        this.logger.info(
          "Updated phone numeber in Firebase for business: ",
          business_id,
        );
      } catch (error) {
        this.logger.error("Error updating phoneNumber in Firebase:", error);
        throw new Error("Error updating phone number in Firebase.");
      }
    }

    const data = await this.businessDao.updateBusinessData(business_id, update);
    return data;
  }

  async getAllBusinessInfo(
    filters: Record<string, string[]>,
    page: string,
    limit: string,
  ) {
    this.logger.info(
      `Business Service: 
        Fetching all business profile`,
    );
    const data = await this.businessDao.findAllBusiness(filters, page, limit);
    return data;
  }
  async getBusinessByEmail(email: string) {
    this.logger.info(
      `Business Service: 
        Fetching  business profile with Email`,
    );
    const data = await this.businessDao.findOneByEmail(email);
    return data;
  }
  async getBusinessProfile(id: string) {
    this.logger.info(
      `Business Service: 
        Fetching  business profile with Id `,
      id,
    );

    const business: any = await this.businessDao.getById(id);
    return business;
  }

  async createBusinessProject(business_id: string, data: any) {
    this.logger.info(
      `Business Service: 
        Creating business Project`,
    );
    const BusinessExist = await this.businessDao.getBusinessById(business_id);
    if (!BusinessExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.BUSINESS_NOT_FOUND,
        ERROR_CODES.BUSINESS_NOT_FOUND,
      );
    }

    const projectCost = Number(process.env.PROJECT_CREATION_COST) || 0;

    if (BusinessExist.connects < projectCost) {
      throw new Error("Insufficient connects to create a project.");
    }

    BusinessExist.connects -= projectCost;
    await BusinessExist.save();

    const companyData = BusinessExist;
    const Project = await this.businessDao.createProjectBusiness({
      ...data,
      companyName: companyData.companyName,
      companyId: companyData._id,
    });
    const { _id } = Project;
    await this.businessDao.addProjectById(business_id, _id);
    return Project;
  }
  async getBusinessProjectById(id: string) {
    this.logger.info(
      `Business Service: 
        Fetching business project by id`,
    );
    await this.businessDao.findBusinessProject(id);
  }
  async getAllProjectsData(
    filters: {
      location?: string[];
      jobType?: string[];
      domain?: string[];
      skills?: string[];
      projectDomain?: string[];
    },
    freelancer_id: string,
    page: string,
    limit: string,
  ) {
    const { location, jobType, domain, skills, projectDomain } = filters;

    this.logger.info(
      `Business Service: Fetching all business projects with filters - Location: ${location}, Job Type: ${jobType}, Domain: ${domain}, Skills: ${skills},limit:${limit},page:${page}, projectDomain: ${projectDomain}`,
    );

    const freelancerExist =
      await this.FreelancerDAO.findFreelancerById(freelancer_id);
    if (!freelancerExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    // Ensure notInterestedProject is defined
    const notInterestedProjects = freelancerExist.notInterestedProject || [];

    const dataSet = await this.businessDao.findAllProjects(
      {
        location,
        jobType,
        domain,
        skills,
        projectDomain,
      },
      page,
      limit,
    );

    const data = dataSet.filter(
      (project) => !notInterestedProjects.includes(project._id.toString()),
    );

    return data;
  }

  async updateBusinessProjectData(id: string, update: any) {
    this.logger.info(
      `Business Service: 
        updating business projects`,
    );
    const data = await this.businessDao.updateBusinessProject(id, update);
    return data;
  }
  async deleteBusinessProject(id: string) {
    this.logger.info(
      `Business Service: 
        deleting business projects`,
    );
    const data = await this.businessDao.deleteBusinessProject(id);
    return data;
  }
  async getSingleProjectByIdWithVerification(
    project_id: string,
    freelancer_id: string,
  ) {
    try {
      this.logger.info(
        "BusinessService: business get projects by id",
        project_id,
      );

      const data = await this.businessDao.getProjectById(project_id);

      if (!data) {
        throw new NotFoundError(
          RESPONSE_MESSAGE.PROJECT_NOT_FOUND,
          ERROR_CODES.BUSINESS_PROJECT_NOT_FOUND,
        );
      }

      const projectData = data.toObject();

      // Check if profiles exist and are an array
      if (!data.profiles || !Array.isArray(data.profiles)) {
        throw new Error(
          "Profiles data is missing or not in the expected format",
        );
      }

      // Map over profiles and resolve the promises using Promise.all
      const alreadyApplied = await Promise.all(
        data.profiles.map(async (profile: any) => {
          const existence = profile.totalBid?.some(
            (id: string) => id === freelancer_id,
          );

          // Set the message if the freelancer has already applied
          const message = existence ? "Already Applied" : null;

          return {
            _id: profile._id,
            exist: existence,
            message: message,
          };
        }),
      );

      // Filter profiles where the freelancer has already applied
      const appliedProfiles = alreadyApplied.filter((profile) => profile.exist);

      // If any profiles have an application, return the message and applied data
      if (appliedProfiles.length > 0) {
        return {
          data: projectData,
          applied: appliedProfiles,
          message: "Freelancer has already applied to one or more profiles.",
        };
      }

      // Return project data if no application was found
      return { data: projectData };
    } catch (error) {
      this.logger.error("Error in getSingleProjectById:", error);
      throw error;
    }
  }
  async getSingleProjectById(project_id: string) {
    try {
      this.logger.info(
        "BusinessService: business get projects by id",
        project_id,
      );

      const data = await this.businessDao.getProjectById(project_id);

      if (!data) {
        throw new NotFoundError(
          RESPONSE_MESSAGE.PROJECT_NOT_FOUND,
          ERROR_CODES.BUSINESS_PROJECT_NOT_FOUND,
        );
      }

      return data;
    } catch (error) {
      this.logger.error("Error in getSingleProjectById:", error);
      throw error;
    }
  }

  async getBusinessProjectsById(
    businessId: string,
    status?: StatusEnum,
  ): Promise<IProject[]> {
    this.logger.info("BusinessService: Fetching projects for business", {
      businessId,
    });

    // Check if the business exists
    const businessExists = await this.businessDao.findBusinessById(businessId);
    if (!businessExists) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.BUSINESS_NOT_FOUND,
        ERROR_CODES.BUSINESS_NOT_FOUND,
      );
    }

    // Validate status if provided
    if (status && !Object.values(StatusEnum).includes(status)) {
      throw new Error(RESPONSE_MESSAGE.INVALID("Status"));
    }

    // Fetch the projects for the business
    const projects = await this.ProjectDAO.getBusinessProjectsById(
      businessId,
      status,
    );
    this.logger.info("BusinessService: Projects fetched", {
      businessId,
      status,
      projectsCount: projects.length,
    });

    return projects;
  }

  async getAllProject(
    filters: Record<string, string[]>,
    page: string,
    limit: string,
  ) {
    this.logger.info("BusinessService: getAllProject: Fetching All Projects ");

    const projects: any = await this.ProjectDAO.getAllProjects(
      filters,
      page,
      limit,
    );

    if (!projects) {
      this.logger.error("BusinessService: getAllProject: project not found ");
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Project"),
        ERROR_CODES.BUSINESS_PROJECT_NOT_FOUND,
      );
    }

    return projects;
  }
  async getProjectProfileById(project_id: string, profile_id: string) {
    this.logger.info(
      "BusinessService: business get projects profile by id",
      profile_id,
    );

    const projectExits =
      await this.ProjectDAO.getBusinessProjectsById(project_id);
    if (!projectExits) {
      this.logger.error(
        "BusinessService: getProjectProfileById: project not found ",
      );
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Project"),
        ERROR_CODES.BUSINESS_PROJECT_NOT_FOUND,
      );
    }

    const data = await this.ProjectDAO.getProjectProfileById(
      project_id,
      profile_id,
    );

    return data;
  }

  async updateProjectProfileById(
    project_id: string,
    profile_id: string,
    update: any,
  ) {
    this.logger.info(
      "BusinessService:updateProjectProfileById: business update projects profile by id",
      profile_id,
    );
    const projectExits =
      await this.ProjectDAO.getBusinessProjectsById(project_id);
    if (!projectExits) {
      this.logger.error(
        "BusinessService: getProjectProfileById: project not found ",
      );
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Project"),
        ERROR_CODES.BUSINESS_PROJECT_NOT_FOUND,
      );
    }
    const profileExist = await this.ProjectDAO.getProjectProfileById(
      project_id,
      profile_id,
    );

    if (
      !profileExist ||
      !profileExist.profiles ||
      profileExist.profiles.length === 0
    ) {
      this.logger.error(
        "BusinessService: getProjectProfileById: profile not found",
      );
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Profile"),
        ERROR_CODES.NOT_FOUND,
      );
    }
    const data = await this.ProjectDAO.updateProjectProfileById(
      project_id,
      profile_id,
      update,
    );
    return data;
  }
  async deleteProjectProfileById(project_id: string, profile_id: string) {
    this.logger.info(
      "BusinessService:deleteProjectProfileById: business delete projects profile by id",
      profile_id,
    );
    const projectExits =
      await this.ProjectDAO.getBusinessProjectsById(project_id);
    if (!projectExits) {
      this.logger.error(
        "BusinessService: getProjectProfileById: project not found ",
      );
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Project"),
        ERROR_CODES.BUSINESS_PROJECT_NOT_FOUND,
      );
    }
    const profileExist = await this.ProjectDAO.getProjectProfileById(
      project_id,
      profile_id,
    );
    if (
      !profileExist ||
      !profileExist.profiles ||
      profileExist.profiles.length === 0
    ) {
      this.logger.error(
        "BusinessService: getProjectProfileById: profile not found",
      );
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Profile"),
        ERROR_CODES.NOT_FOUND,
      );
    }
    const data = await this.ProjectDAO.deleteProjectProfileById(
      project_id,
      profile_id,
    );
    return data;
  }

  async getProjectAndBidsData(project_id: string) {
    this.logger.info(
      "BusinessService: business get projects and bids data by project id",
      project_id,
    );

    const projectExits = await this.ProjectDAO.getProjectById(project_id);
    if (!projectExits) {
      this.logger.error(
        "BusinessService: getProjectProfileById: project not found ",
      );
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Project"),
        ERROR_CODES.BUSINESS_PROJECT_NOT_FOUND,
      );
    }

    const data = await this.ProjectDAO.getProjectAndBidsData(project_id);
    return data;
  }

  async updateProjectStatusByProjectID(
    projectId: string,
    status: StatusEnum,
  ): Promise<IProject> {
    // Validate the status against the StatusEnum
    if (!Object.values(StatusEnum).includes(status)) {
      throw new Error(RESPONSE_MESSAGE.INVALID("Status"));
    }

    // Update the status using the DAO
    const project = await this.ProjectDAO.updateStatus(projectId, status);

    // Handle the case where the project is not found
    if (!project) {
      throw new Error(RESPONSE_MESSAGE.NOT_FOUND("Project"));
    }

    return project;
  }

  // Method to update the status of a business
  async updateBusinessStatus(business_id: string, status: BusinessStatusEnum) {
    try {
      // Validate the status against the StatusEnum
      if (!Object.values(BusinessStatusEnum).includes(status)) {
        throw new Error(RESPONSE_MESSAGE.INVALID("Status"));
      }
      const result = await this.businessDao.updateBusinessStatus(
        business_id,
        status,
      );

      // Check if result is null or not
      if (!result) {
        throw new Error(
          "Failed to update the business status. No business found.",
        );
      }

      return { message: `Business status updated to ${status}` };
    } catch (error) {
      console.log(error);
    }
  }

  async updateBiddingDate(
    project_id: string,
    maxBiddingDate: Date,
    startBiddingDate: Date,
  ) {
    this.logger.info("FreelancerService: maxBiddingDate", project_id);
    const projectExist = await this.ProjectDAO.getProjectById(project_id);
    if (!projectExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.PROJECT_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }
    if (maxBiddingDate < new Date()) {
      throw new Error("maxBidDate is less than current date");
    }

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    if (startBiddingDate.getTime() < startOfToday.getTime()) {
      throw new Error(
        "startBiddingDate cannot be in the past. It must be today or a future date.",
      );
    }

    const data = await this.ProjectDAO.updateBiddingDate(
      project_id,
      maxBiddingDate,
      startBiddingDate,
    );
    return data;
  }

  async createKYCDetails(business_id: string, body: any) {
    this.logger.info(`Creating KYC details for Business ID: ${business_id}`);

    // Fetching business details to ensure the business exists
    const business = await this.businessDao.getById(business_id);
    if (!business) {
      this.logger.error(`Business not found with ID: ${business_id}`);
      throw new NotFoundError(
        RESPONSE_MESSAGE.BUSINESS_NOT_FOUND,
        ERROR_CODES.BUSINESS_NOT_FOUND,
      );
    }

    const createKyc = await this.businessDao.createBusinessKyc(
      business_id,
      body,
    );
    return (createKyc as any).kyc;
  }

  async updateKYCDetails(
    business_id: string,
    kycDetails: {
      businessProof: string;
      verification: string;
      frontImageUrl: string;
      backImageUrl: string;
      liveCapture: string;
      status: KycBusinessStatusEnum;
    },
  ) {
    this.logger.info(`Updating KYC details for Business ID: ${business_id}`);

    // Fetching business details to ensure the business exists
    const business = await this.businessDao.getById(business_id);
    if (!business) {
      this.logger.error(`Business not found with ID: ${business_id}`);
      throw new NotFoundError(
        RESPONSE_MESSAGE.BUSINESS_NOT_FOUND,
        ERROR_CODES.BUSINESS_NOT_FOUND,
      );
    }
    const updatedKyc = await this.businessDao.updateBusinessKyc(
      business_id, // Pass business_id directly
      {
        businessProof: kycDetails.businessProof,
        verification: kycDetails.verification,
        frontImageUrl: kycDetails.frontImageUrl,
        backImageUrl: kycDetails.backImageUrl,
        liveCapture: kycDetails.liveCapture,
        status: kycDetails.status,
      },
    );

    return (updatedKyc as any).kyc;
  }
}
