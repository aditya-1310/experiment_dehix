import { Service, Inject } from "fastify-decorators";

// import pkg from "jsonwebtoken";
// const {
//   sign: jwtSign,
//   verify: jwtVerify,
//   TokenExpiredError,
//   JsonWebTokenError,
// } = pkg;

import { BaseService } from "../common/base.service";
import { ConflictError, NotFoundError } from "../common/errors";
import { ERROR_CODES, RESPONSE_MESSAGE } from "../common/constants";
import { FreelancerDAO } from "../dao/freelancer.dao";
import { firebaseClient } from "../common/services";
import { SESService } from "../common/services";
import { ProjectDAO } from "../dao/project.dao";
import { VerificationService } from "./verifications.service";
import { BidDAO } from "../dao";
import { StatusEnum } from "../models/project.entity";
import {
  IFreelancer,
  FreelancerStatusEnum,
  FreelancerOracleNdConsultantStatusEnum,
  KycStatusEnum,
} from "../models/freelancer.entity";
import {
  PutFreelancerEducationBody,
  PutFreelancerExperinceBody,
  PutFreelancerProjectBody,
} from "../types/v1/freelancer/updateProfile";
import {
  CreateFreelancerEducationBody,
  CreateFreelancerExperienceBody,
  CreateFreelancerProjectBody,
} from "../types/v1/freelancer/createFreelancer";
import { InterviewService } from "./interview.service";
import { generateReferralCode } from "../common/utils";

@Service()
export class FreelancerService extends BaseService {
  @Inject(FreelancerDAO)
  private FreelancerDAO!: FreelancerDAO;

  @Inject(ProjectDAO)
  private ProjectDAO!: ProjectDAO;

  @Inject(BidDAO)
  private BidDAO!: BidDAO;

  @Inject(SESService)
  private sesService!: SESService;

  @Inject(VerificationService)
  private VerificationService!: VerificationService;

  @Inject(InterviewService)
  private InterviewService!: InterviewService;

  async getAllFreelancer(
    filters: Record<string, string[]>,
    page: string,
    limit: string,
  ) {
    this.logger.info(
      `FreelancerService: getAllFreelancer: Fetching all freelancers with the given set of filters -->`,
    );

    const formattedFilters: Record<string, any> = {};

    for (const [key, value] of Object.entries(filters)) {
      if (Array.isArray(value)) {
        formattedFilters[key] = { $in: value };
      } else {
        formattedFilters[key] = value;
      }
    }

    const data = await this.FreelancerDAO.findAllFreelancers(
      formattedFilters,
      page,
      limit,
    );

    return data;
  }
  async deleteFreelancerSkill(freelancer_id: string, skill_id: string) {
    this.logger.info(
      `FreelancerService: deleteFreelancerSkill: Deleting skill for Freelancer ID:${freelancer_id} and Skill ID:${skill_id}`,
    );
    const freelancerExist = await this.FreelancerDAO.getById(freelancer_id);
    if (!freelancerExist) {
      this.logger.error(
        "FreelancerService: getFreelancerProfile: Freelancer not found with ID: ",
        freelancer_id,
      );
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }
    const checkSkill = await this.FreelancerDAO.findSkillExistInFreelancer(
      freelancer_id,
      skill_id,
    );
    if (!checkSkill) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }
    const delete_skill = await this.FreelancerDAO.updateFreelancer(
      { _id: freelancer_id },
      { $pull: { skills: { _id: skill_id } } },
    );

    return delete_skill;
  }

  async getFreelancerProfileByUserName(freelancer_username: string) {
    this.logger.info(
      "FreelancerService: getFreelancerProfile: Fetching FREELANCER profile for userName: ",
      freelancer_username,
    );

    const freelancer: any =
      await this.FreelancerDAO.findFreelancerByUsername(freelancer_username);

    if (!freelancer) {
      this.logger.error(
        "FreelancerService: getFreelancerProfile: Freelancer not found with userName: ",
        freelancer_username,
      );
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }
    return freelancer;
  }
  async getFreelancerProfileById(freelancerId: string) {
    this.logger.info(
      "FreelancerService: getFreelancerProfile: Fetching FREELANCER profile for userName: ",
      freelancerId,
    );

    const freelancer: any =
      await this.FreelancerDAO.findFreelancerById(freelancerId);

    if (!freelancer) {
      this.logger.error(
        "FreelancerService: getFreelancerProfile: Freelancer not found with userName: ",
        freelancerId,
      );
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }
    return freelancer;
  }

  async createFreelancerProfile(freelancer: any, referralCode?: string | null) {
    try {
      this.logger.info(
        "FreelancerService: createFreelancerProfile: Creating Freelancer: ",
        freelancer,
      );
      /*
        Flow will be in this order:
          1- check if referral code given or not, if yes then check the referrer exits not not
          2- create firebase user
          3- generatw referral code for new user
          4- create new freelancer in db
          5- after succesful creation of freelancer, referral bonus will be given
      */

      // Check if referral code is provided and referrer is valid
      let referrer: any = null;
      if (referralCode != null) {
        referrer =
          await this.FreelancerDAO.getFreelancerByReferralCode(referralCode);
        if (!referrer) {
          this.logger.error(
            "FreelancerService: createFreelancerProfile: Referrer not found with Referral Code: ",
            referralCode,
          );
          throw new Error("Invalid referral code.");
        }
      }

      // Create Firebase user
      const freelancer_id =
        await firebaseClient.createFireBaseUserWithCustomClaims(
          freelancer.email,
          freelancer.password,
          { type: "freelancer" },
          freelancer.userName,
          freelancer.phone,
        );
      freelancer._id = freelancer_id;

      //uncomment when SES is up
      // const { SENDER, SUBJECT, TEXTBODY } = CREATE_PASSWORD_EMAIL_CONSTANTS;
      // await this.sesService.sendEmail({
      //   sender: SENDER!,
      //   recipient: [freelancer.email],
      //   subject: SUBJECT,
      //   textBody: TEXTBODY.replace(":passLink", reset_link),
      // });

      // Generate referrer code for new user
      freelancer.referral.referralCode = await generateReferralCode(
        freelancer.userName,
      ); //Assign referralCode

      // create new freelancer
      const userObj = { ...freelancer, password: "" };
      const data: any = await this.FreelancerDAO.createFreelancer(userObj);
      if (data.description && data.description.length > 500) {
        throw new Error("Description cannot exceed 500 characters.");
      }

      // Add referral bonus if the referrer exists
      if (referrer) {
        await this.FreelancerDAO.addReferralBonus(referrer._id, freelancer._id);
        this.logger.info(
          `FreelancerService: createFreelancerProfile: Referral bonus added for Referrer ID: ${referrer._id} and Referee ID: ${freelancer._id}`,
        );
      }

      return data;
    } catch (error: any) {
      if (freelancer._id) {
        try {
          await firebaseClient.deleteFireBaseUser(freelancer._id);
          this.logger.info(
            `Rolled back Firebase user creation for ID: ${freelancer._id}`,
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
        throw error;
      }
    }
  }

  async updateKYCDetails(
    freelancer_id: string,
    kycDetails: {
      aadharOrGovtId: string;
      frontImageUrl: string;
      backImageUrl: string;
      liveCapture: string;
      status: KycStatusEnum;
    },
  ) {
    this.logger.info(
      `Updating KYC details for Freelancer ID: ${freelancer_id}`,
    );

    // Fetching freelancer details to ensure the freelancer exists
    const freelancer = await this.FreelancerDAO.getById(freelancer_id);
    if (!freelancer) {
      this.logger.error(`Freelancer not found with ID: ${freelancer_id}`);
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }
    const updatedKyc = await this.FreelancerDAO.updateFreelancerKyc(
      freelancer_id, // Pass freelancer_id directly
      {
        aadharOrGovtId: kycDetails.aadharOrGovtId,
        frontImageUrl: kycDetails.frontImageUrl,
        backImageUrl: kycDetails.backImageUrl,
        liveCapture: kycDetails.liveCapture,
        status: kycDetails.status,
      },
    );

    return (updatedKyc as any).kyc;
  }

  async addFreelancerSkills(freelancer_id: string, skills: string[]) {
    this.logger.info(
      `FreelancerService -> addFreelancerSkills -> Adding skills for freelancer ID: ${freelancer_id}`,
    );

    const freelancerExist = await this.FreelancerDAO.getById(freelancer_id);
    if (!freelancerExist) {
      this.logger.error(
        "FreelancerService: getFreelancerProfile: Freelancer not found with ID: ",
        freelancer_id,
      );
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    const { skillIds, skillsWithId: addSkills } =
      await this.FreelancerDAO.addFreelancerSkill(freelancer_id, skills);

    await Promise.all(
      skillIds.map((skillId) =>
        this.VerificationService.requestVerification(
          skillId,
          "skill",
          freelancer_id,
        ),
      ),
    );

    return {
      addSkills,
      freelancer_id,
    };
  }

  async updateProfileFreelancer(freelancer_id: string, freelancer: any) {
    this.logger.info(
      "FreelancerService: updateProfileFreelancer: Updating Freelancer: ",
      freelancer_id,
      freelancer,
    );

    // If a profile picture is provided, update the avatar_url in Firebase
    if (freelancer.profilePic) {
      try {
        // Call the updateUser function to update the avatar_url in Firebase
        await firebaseClient.updateUser(freelancer_id, {
          photoURL: freelancer.profilePic, // Assuming the profilePic is the URL of the image
        });
        this.logger.info(
          "Updated avatar_url in Firebase for freelancer: ",
          freelancer_id,
        );
      } catch (error) {
        this.logger.error("Error updating avatar_url in Firebase:", error);
        throw new Error("Error updating avatar in Firebase.");
      }
    }

    if (freelancer.phone) {
      try {
        // Call the updateUser function to update the verified phone number in Firebase
        await firebaseClient.updateUser(freelancer_id, {
          phoneNumber: freelancer.phone,
        });
        this.logger.info(
          "Updated phone number in Firebase for freelancer: ",
          freelancer_id,
        );
      } catch (error) {
        this.logger.error("Error updating phone number in Firebase:", error);
        throw new Error("Error updating phone number in Firebase.");
      }
    }

    const data: any = await this.FreelancerDAO.updateFreelancer(
      { _id: freelancer_id },
      freelancer,
    );

    if (data.description && data.description.length > 500) {
      throw new Error("Description cannot exceed 500 characters.");
    }

    return data;
  }

  async updateFreelancerOracleStatus(
    freelancer_id: string,
    oracle_status: FreelancerOracleNdConsultantStatusEnum,
  ) {
    this.logger.info(
      "FreelancerService: updateFreelancerOracleStatus: Updating Freelancer Oracle Status: ",
      freelancer_id,
      oracle_status,
    );

    // Validate the status against the StatusEnum
    if (
      !Object.values(FreelancerOracleNdConsultantStatusEnum).includes(
        oracle_status,
      )
    ) {
      throw new Error(RESPONSE_MESSAGE.INVALID("Status"));
    }

    const data: any = await this.FreelancerDAO.updateOracleStatusById(
      freelancer_id,
      oracle_status,
    );

    return data;
  }

  async freelancerInterviewsAligned(
    freelancer_id: string,
    interviews_aligned: string[],
  ) {
    this.logger.info(
      "FreelancerService: freelancerInterviewsAligned: Freelancer Interviews aligned: ",
      freelancer_id,
      interviews_aligned,
    );

    const freelancerExist =
      await this.FreelancerDAO.findFreelancerById(freelancer_id);
    if (!freelancerExist) {
      this.logger.error(
        `FreelancerService: getFreelancerProfile: Freelancer not found with ID: ${freelancer_id} `,
      );
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    const data: any = await this.FreelancerDAO.interviewsAlignedById(
      freelancer_id,
      interviews_aligned,
    );

    return data;
  }

  async putFreelancerExperience(
    freelancer_id: string,
    experience_id: string,
    update: PutFreelancerExperinceBody,
  ) {
    this.logger.info(
      "FreelancerService: freelancer experience put ",
      freelancer_id,
    );
    const userExist =
      await this.FreelancerDAO.findFreelancerById(freelancer_id);
    if (!userExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }
    const experinceExist = await this.FreelancerDAO.getExperienceById(
      freelancer_id,
      experience_id,
    );
    if (!experinceExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.EXPERIENCE_NOT_FOUND,
        ERROR_CODES.EXPERIENCE_NOT_FOUND,
      );
    }

    const data = await this.FreelancerDAO.putExperienceById(
      freelancer_id,
      experience_id,
      update,
    );
    this.logger.info(data, "in update experience");
    return data;
  }

  async deleteFreelancerExperience(freelancerId: string, experienceId: string) {
    this.logger.info(
      "FreelancerService: deleteFreelancerExperience",
      freelancerId,
    );

    const userExist = await this.FreelancerDAO.findFreelancerById(freelancerId);
    if (!userExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    const experienceExist = await this.FreelancerDAO.getExperienceById(
      freelancerId,
      experienceId,
    );
    if (!experienceExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.EXPERIENCE_NOT_FOUND,
        ERROR_CODES.EXPERIENCE_NOT_FOUND,
      );
    }

    const data = await this.FreelancerDAO.deleteExperienceById(
      freelancerId,
      experienceId,
    );
    return data;
  }

  async createFreelancerExperience(
    freelancer_id: string,
    experienceData: CreateFreelancerExperienceBody,
  ) {
    try {
      this.logger.info(
        "FreelancerService: create freelancer experience ",
        freelancer_id,
      );

      // Check if freelancer exists
      const userExist =
        await this.FreelancerDAO.findFreelancerById(freelancer_id);
      if (!userExist) {
        throw new NotFoundError(
          RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
          ERROR_CODES.FREELANCER_NOT_FOUND,
        );
      }

      // Create new experience entry
      const { experienceId, result: createdExperience } =
        await this.FreelancerDAO.addExperienceById(
          freelancer_id,
          experienceData,
        );

      try {
        await this.VerificationService.requestVerification(
          experienceId,
          "experience",
          freelancer_id,
        );
      } catch (error: any) {
        // Log the error using your logger service
        this.logger.error(
          `Error requesting verification for experience ID ${experienceId}: ${error.message}`,
        );
      }
      return createdExperience;
    } catch (error: any) {
      throw new Error(
        `Failed to create freelancer experience: ${error.message}`,
      );
    }
  }

  async createFreelancerEducation(
    freelancer_id: string,
    educationData: CreateFreelancerEducationBody,
  ) {
    try {
      this.logger.info(
        "FreelancerService: create freelancer education ",
        freelancer_id,
      );

      // Check if freelancer exists
      const userExist =
        await this.FreelancerDAO.findFreelancerById(freelancer_id);
      if (!userExist) {
        throw new NotFoundError(
          RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
          ERROR_CODES.FREELANCER_NOT_FOUND,
        );
      }

      // Create new education entry
      const { educationId, result: createdEducation } =
        await this.FreelancerDAO.addEducationById(freelancer_id, educationData);

      await this.VerificationService.requestVerification(
        educationId,
        "education",
        freelancer_id,
      );
      return createdEducation;
    } catch (error: any) {
      throw new Error(
        `Failed to create freelancer education: ${error.message}`,
      );
    }
  }

  async putFreelancerEducation(
    freelancer_id: string,
    education_id: string,
    update: PutFreelancerEducationBody,
  ) {
    this.logger.info(
      "FreelancerService: freelancer education put ",
      freelancer_id,
    );

    const userExist =
      await this.FreelancerDAO.findFreelancerById(freelancer_id);
    if (!userExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    const educationExist = await this.FreelancerDAO.getEducationById(
      freelancer_id,
      education_id,
    );
    if (!educationExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.EDUCATION_NOT_FOUND,
        ERROR_CODES.EDUCATION_NOT_FOUND,
      );
    }

    const data = await this.FreelancerDAO.putEducationById(
      freelancer_id,
      education_id,
      update,
    );
    this.logger.info(data, "in update education");
    return data;
  }

  async getFreelancerProjects(freelancer_id: string, status?: StatusEnum) {
    this.logger.info(
      "FreelancerService: freelancer get projects",
      freelancer_id,
    );

    const userExist =
      await this.FreelancerDAO.findFreelancerById(freelancer_id);
    if (!userExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    const data = await this.BidDAO.getProjectByBidderId(freelancer_id, status);

    return data;
  }

  async deleteFreelancerEducation(freelancer_id: string, education_id: string) {
    this.logger.info(
      "FreelancerService: deleteFreelancerEducation",
      freelancer_id,
    );

    const userExist =
      await this.FreelancerDAO.findFreelancerById(freelancer_id);
    if (!userExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    const educationExist = await this.FreelancerDAO.getEducationById(
      freelancer_id,
      education_id,
    );
    if (!educationExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.EDUCATION_NOT_FOUND,
        ERROR_CODES.EDUCATION_NOT_FOUND,
      );
    }

    const data = await this.FreelancerDAO.deleteEducationById(
      freelancer_id,
      education_id,
    );
    return data;
  }

  async createFreelancerProject(
    freelancer_id: string,
    projectData: CreateFreelancerProjectBody,
  ) {
    try {
      this.logger.info(
        "FreelancerService: create freelancer project ",
        freelancer_id,
      );

      // Check if freelancer exists
      const userExist =
        await this.FreelancerDAO.findFreelancerById(freelancer_id);
      if (!userExist) {
        throw new NotFoundError(
          RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
          ERROR_CODES.FREELANCER_NOT_FOUND,
        );
      }

      // Create new project entry
      const { projectId, result: createdProject } =
        await this.FreelancerDAO.addProjectById(freelancer_id, projectData);

      await this.VerificationService.requestVerification(
        projectId,
        "project",
        freelancer_id,
      );
      return createdProject;
    } catch (error: any) {
      throw new Error(`Failed to create freelancer project: ${error.message}`);
    }
  }

  async putFreelancerProject(
    freelancer_id: string,
    project_id: string,
    update: PutFreelancerProjectBody,
  ) {
    this.logger.info(
      "FreelancerService: freelancer project put ",
      freelancer_id,
    );

    const userExist =
      await this.FreelancerDAO.findFreelancerById(freelancer_id);
    if (!userExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    const projectExist = await this.FreelancerDAO.getProjectById(
      freelancer_id,
      project_id,
    );
    if (!projectExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_PROJECT_NOT_FOUND,
        ERROR_CODES.FREELANCER_PROJECT_NOT_FOUND,
      );
    }

    const data = await this.FreelancerDAO.putProjectById(
      freelancer_id,
      project_id,
      update,
    );
    this.logger.info(data, "in update project");
    return data;
  }

  async deleteFreelancerProject(freelancer_id: string, project_id: string) {
    this.logger.info(
      `FreelancerService: deleteFreelancerProject: Deleting project using: Freelancer ID:${freelancer_id} and Project ID:${project_id}`,
    );
    const project_exist = this.FreelancerDAO.findProject(
      freelancer_id,
      project_id,
    );
    if (!project_exist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_PROJECT_NOT_FOUND,
        ERROR_CODES.FREELANCER_PROJECT_NOT_FOUND,
      );
    }
    const delete_project = this.FreelancerDAO.deleteProjectById(
      freelancer_id,
      project_id,
    );

    return delete_project;
  }

  async addFreelancerDomain(freelancer_id: string, domains: string[]) {
    this.logger.info(
      `FreelancerService -> addFreelancerDomain -> Adding domain for freelancer ID: ${freelancer_id}`,
    );

    const freelancerExist = await this.FreelancerDAO.getById(freelancer_id);
    if (!freelancerExist) {
      this.logger.error(
        "FreelancerService: getFreelancerProfile: Freelancer not found with ID: ",
        freelancer_id,
      );
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    const { domainIds, domainsWithId: addDomains } =
      await this.FreelancerDAO.addFreelancerDomain(freelancer_id, domains);

    await Promise.all(
      domainIds.map((domainId) =>
        this.VerificationService.requestVerification(
          domainId,
          "domain",
          freelancer_id,
        ),
      ),
    );

    return {
      addDomains,
      freelancer_id,
    };
  }

  async deleteFreelancerDomain(freelancer_id: string, domain_id: string) {
    this.logger.info(
      `FreelancerService: deleteFreelancerDomain: Deleting domain for Freelancer ID:${freelancer_id} and Domain ID:${domain_id}`,
    );
    const freelancerExist = await this.FreelancerDAO.getById(freelancer_id);
    if (!freelancerExist) {
      this.logger.error(
        "FreelancerService: getFreelancerProfile: Freelancer not found with ID: ",
        freelancer_id,
      );
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }
    const checkDomain = await this.FreelancerDAO.findDomainExistInFreelancer(
      freelancer_id,
      domain_id,
    );
    if (!checkDomain) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }
    const delete_domain = await this.FreelancerDAO.updateFreelancer(
      { _id: freelancer_id },
      { $pull: { domain: { _id: domain_id } } },
    );

    return delete_domain;
  }

  async getFreelancerOwnProjects(freelancer_id: string) {
    this.logger.info(
      "FreelancerService: freelancer get own projects",
      freelancer_id,
    );

    const userExist =
      await this.FreelancerDAO.findFreelancerById(freelancer_id);
    if (!userExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    const data =
      await this.FreelancerDAO.getFreelancerOwnProjects(freelancer_id);
    this.logger.info(data, "in get freelancer projects");
    return data;
  }

  async getFreelancerSkills(freelancer_id: string) {
    this.logger.info("FreelancerService: freelancer get skills", freelancer_id);

    const userExist =
      await this.FreelancerDAO.findFreelancerById(freelancer_id);
    if (!userExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    const data = await this.FreelancerDAO.getFreelancerSkills(freelancer_id);
    this.logger.info(data, "in get freelancer skills");
    return data;
  }

  async getFreelancerDomains(freelancer_id: string) {
    this.logger.info(
      "FreelancerService: freelancer get domains",
      freelancer_id,
    );

    const userExist =
      await this.FreelancerDAO.findFreelancerById(freelancer_id);
    if (!userExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    const data = await this.FreelancerDAO.getFreelancerDomains(freelancer_id);
    this.logger.info(data, "in get freelancer domains");
    return data;
  }

  async createFreelancerDehixTalent(
    freelancer_id: string,
    dehixTalentData: any,
  ) {
    try {
      this.logger.info(
        "FreelancerService: create freelancer dehix talent ",
        freelancer_id,
      );

      // Check if freelancer exists
      const userExist =
        await this.FreelancerDAO.findFreelancerById(freelancer_id);
      if (!userExist) {
        throw new NotFoundError(
          RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
          ERROR_CODES.FREELANCER_NOT_FOUND,
        );
      }

      // Create new dehix talent entry
      const createDehixTalent = await this.FreelancerDAO.addDehixTalentById(
        freelancer_id,
        dehixTalentData,
      );

      // Return the newly created talent data
      return createDehixTalent;
    } catch (error: any) {
      throw new Error(
        `Failed to create freelancer dehix talent: ${error.message}`,
      );
    }
  }

  async deleteFreelancerDehixTalent(
    freelancerId: string,
    dehixTalentId: string,
  ) {
    this.logger.info(
      "FreelancerService: deleteFreelancerDehixTalent",
      freelancerId,
    );

    const userExist = await this.FreelancerDAO.findFreelancerById(freelancerId);
    if (!userExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    const dehixTalentExist = await this.FreelancerDAO.getDehixTalentById(
      freelancerId,
      dehixTalentId,
    );
    if (!dehixTalentExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.DEHIX_TALENT_NOT_FOUND,
        ERROR_CODES.DEHIX_TALENT_NOT_FOUND,
      );
    }

    const data = await this.FreelancerDAO.deleteDehixTalentById(
      freelancerId,
      dehixTalentId,
    );
    return data;
  }

  async createConsultant(freelancer_id: string, body: any) {
    this.logger.info("FreelancerService: createConsultant", freelancer_id);
    const freelancerExist =
      await this.FreelancerDAO.findFreelancerById(freelancer_id);
    if (!freelancerExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }
    const data = await this.FreelancerDAO.addConsultant(freelancer_id, body);
    return data;
  }

  async updateConsultant(
    freelancer_id: string,
    consultant_id: string,
    update: any,
  ) {
    this.logger.info("FreelancerService: updateConsultant", freelancer_id);
    const freelancerExist =
      await this.FreelancerDAO.findFreelancerById(freelancer_id);
    if (!freelancerExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }
    const consultantExist = await this.FreelancerDAO.getConsultantById(
      freelancer_id,
      consultant_id,
    );
    if (!consultantExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.CONSULTANT_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }
    const data = await this.FreelancerDAO.updateConsultant(
      freelancer_id,
      consultant_id,
      update,
    );
    return data;
  }

  async getConsultantById(freelancer_id: string, consultant_id: string) {
    this.logger.info("FreelancerService:  getConsultantById", freelancer_id);
    const freelancerExist =
      await this.FreelancerDAO.findFreelancerById(freelancer_id);
    if (!freelancerExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }
    const data = await this.FreelancerDAO.getConsultant(
      freelancer_id,
      consultant_id,
    );
    if (!data) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.CONSULTANT_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }
    return data;
  }

  async deleteConsultant(freelancer_id: string, consultant_id: string) {
    this.logger.info("FreelancerService: updateConsultant", freelancer_id);
    const freelancerExist =
      await this.FreelancerDAO.findFreelancerById(freelancer_id);
    if (!freelancerExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }
    const consultantExist = await this.FreelancerDAO.getConsultantById(
      freelancer_id,
      consultant_id,
    );
    if (!consultantExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.CONSULTANT_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }
    const data = await this.FreelancerDAO.deleteConsultant(
      freelancer_id,
      consultant_id,
    );
    return data;
  }

  async notInterestedProject(freelancer_id: string, project_id: string) {
    this.logger.info("services->freelancer.service->notInterestedProject");
    const freelancerExist =
      await this.FreelancerDAO.findFreelancerById(freelancer_id);
    if (!freelancerExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }
    const projectExist = await this.ProjectDAO.getProjectById(project_id);
    if (!projectExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Project"),
        ERROR_CODES.NOT_FOUND,
      );
    }
    const data = await this.FreelancerDAO.updateNotInterestedProject(
      freelancer_id,
      project_id,
    );
    return data;
  }

  async getAllDehixTalent(limit: number, skip: number) {
    this.logger.info(
      "SkillsService: getAllDehixTalent: Fetching All dehix talent ",
    );

    const dehixTalent: any = await this.FreelancerDAO.getAllDehixTalent(
      limit,
      skip,
    );
    if (!dehixTalent || dehixTalent.length === 0) {
      this.logger.error(
        "FreelancerServices: getAllDehixTalent: Dehix talent not found ",
      );
      throw new NotFoundError(
        RESPONSE_MESSAGE.DEHIX_TALENT_NOT_FOUND,
        ERROR_CODES.DEHIX_TALENT_NOT_FOUND,
      );
    }

    return dehixTalent;
  }

  async getFreelancerDehixTalent(freelancer_id: string) {
    this.logger.info(
      "FreelancerService: freelancer get dehix talent: ",
      freelancer_id,
    );

    const userExist =
      await this.FreelancerDAO.findFreelancerById(freelancer_id);
    if (!userExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    const data =
      await this.FreelancerDAO.getFreelancerDehixTalent(freelancer_id);
    this.logger.info(data, "in get freelancer projects");
    const transformedData = Array.from(data).reduce<any>(
      (result, { _id, dehixTalent }) => {
        if (!dehixTalent) return result;

        Array.from(dehixTalent.entries()).forEach(([_, value]) => {
          const transformedValue = {
            _id: value._id,
            freelancerId: _id,
            type: value.type,
            talentId: value.talentId,
            talentName: value.talentName,
            status: value.status,
            activeStatus: value.activeStatus,
            experience: value.experience,
            level: value.level,
            monthlyPay: value.monthlyPay,
          };

          if (value.type === "SKILL") {
            result.skills.push(transformedValue);
          } else if (value.type === "DOMAIN") {
            result.domains.push(transformedValue);
          }
        });

        return result;
      },
      { skills: [], domains: [] }, // Initial structure
    );

    return transformedData;
  }

  async getFreelancerDehixTalentByStatus(
    freelancer_id: string,
    status: string,
  ) {
    this.logger.info(
      "FreelancerService: freelancer get dehix talent by status: ",
      freelancer_id,
    );
    const userExist =
      await this.FreelancerDAO.findFreelancerById(freelancer_id);
    if (!userExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }
    const data =
      await this.FreelancerDAO.getFreelancerDehixTalent(freelancer_id);
    this.logger.info(data, "in getFreelancerDehixTalent");
    const transformedData = Array.from(data).reduce<any>(
      (result, { _id, dehixTalent }) => {
        if (!dehixTalent) return result;

        Array.from(dehixTalent.entries())
          .filter(([_, value]) => value.status === status)
          .forEach(([_, value]) => {
            const transformedValue = {
              _id: value._id,
              freelancerId: _id,
              type: value.type,
              talentId: value.talentId,
              talentName: value.talentName,
              status: value.status,
              activeStatus: value.activeStatus,
              experience: value.experience,
              level: value.level,
              monthlyPay: value.monthlyPay,
            };

            if (value.type === "SKILL") {
              result.skills.push(transformedValue);
            } else if (value.type === "DOMAIN") {
              result.domains.push(transformedValue);
            }
          });

        return result;
      },
      { skills: [], domains: [] }, // Initial structure
    );

    return transformedData;
  }

  async updateDehixTalent(
    freelancer_id: string,
    dehixTalent_id: string,
    update: any,
  ) {
    this.logger.info("FreelancerService: updateDehixTalent", freelancer_id);
    const freelancerExist =
      await this.FreelancerDAO.findFreelancerById(freelancer_id);
    if (!freelancerExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }
    const dehixTalent = await this.FreelancerDAO.getDehixTalentById(
      freelancer_id,
      dehixTalent_id,
    );
    if (!dehixTalent) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.DEHIX_TALENT_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }
    const data = await this.FreelancerDAO.updateDehixTalent(
      freelancer_id,
      dehixTalent_id,
      update,
    );
    return data;
  }

  async getFreelancerEducation(freelancer_id: string) {
    this.logger.info(
      "FreelancerService: freelancer get education: ",
      freelancer_id,
    );

    const userExist =
      await this.FreelancerDAO.findFreelancerById(freelancer_id);
    if (!userExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    const data = await this.FreelancerDAO.getFreelancerEducation(freelancer_id);
    this.logger.info(data, "in get freelancer education");
    return data;
  }

  async updateFreelancerOnboardingStatus(
    freelancer_id: string,
    onboarding_status: string,
  ) {
    this.logger.info(
      "FreelancerService: updateFreelancerOnboardingStatus: Updating Freelancer Onboarding Status: ",
      freelancer_id,
      onboarding_status,
    );

    const userExist =
      await this.FreelancerDAO.findFreelancerById(freelancer_id);
    if (!userExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    const data: any = await this.FreelancerDAO.updateFreelancerOnboardingStatus(
      freelancer_id,
      onboarding_status,
    );

    return data;
  }

  async updateFreelancerStatusByFreelancerID(
    freelancer_id: string,
    status: FreelancerStatusEnum,
  ): Promise<IFreelancer> {
    if (!Object.values(FreelancerStatusEnum).includes(status)) {
      throw new Error(RESPONSE_MESSAGE.INVALID("Status"));
    }

    const freelancer = await this.FreelancerDAO.updateStatusOfFreelancer(
      freelancer_id,
      status,
    );

    if (!freelancer) {
      throw new Error(RESPONSE_MESSAGE.NOT_FOUND("Freelancer"));
    }

    return freelancer;
  }

  async getSkillDomainVerifiers(
    freelancer_id: string,
    doc_id: string,
    doc_type: "SKILL" | "DOMAIN",
  ) {
    this.logger.info(
      `FreelancerService: get skill or domain verifiers using skill or domain Id: ${doc_id}`,
    );

    const userExist =
      await this.FreelancerDAO.findFreelancerById(freelancer_id);
    if (!userExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    if (doc_type == "SKILL") {
      const freelancers =
        await this.FreelancerDAO.getskillVerifiersBySkill(doc_id);
      return freelancers;
    } else if (doc_type == "DOMAIN") {
      const freelancers =
        await this.FreelancerDAO.getDomainVerifiersByDomain(doc_id);
      return freelancers;
    } else {
      throw new Error(`Provide valid doc_type`);
    }
  }

  async createFreelancerDehixInterviewer(
    freelancer_id: string,
    dehixInterviewerData: any,
  ) {
    try {
      this.logger.info(
        "FreelancerService: create freelancer dehix interviewer ",
        freelancer_id,
      );

      // Check if freelancer exists
      const userExist =
        await this.FreelancerDAO.findFreelancerById(freelancer_id);
      if (!userExist) {
        throw new NotFoundError(
          RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
          ERROR_CODES.FREELANCER_NOT_FOUND,
        );
      }

      // Create new dehix talent entry
      const createDehixInterviewer =
        await this.FreelancerDAO.addDehixInterviewerById(
          freelancer_id,
          dehixInterviewerData,
        );

      // Return the newly created talent data
      return createDehixInterviewer;
    } catch (error: any) {
      throw new Error(
        `Failed to create freelancer dehix talent: ${error.message}`,
      );
    }
  }
}
/**
 * Service method for FREELANCER login
 * @param body
 * @param em
 */
// async login(body: FreelancerLoginBody) {
//   const { email: workEmail, password } = body;
//   let FREELANCER: any = await this.freelancerDAO.findOneByEmail(workEmail);

//   if (!FREELANCER) {
//     throw new BadRequestError('Invalid email or password', ERROR_CODES.INVALID_EMAIL_OR_PASSWORD);
//   }

//   const passwordMatches = await bcrypt.compare(password, FREELANCER.password);
//   if (!passwordMatches) {
//     this.logger.error('FreelancerService: login : Password is incorrect');
//     throw new BadRequestError('Invalid email or password', ERROR_CODES.INVALID_EMAIL_OR_PASSWORD);
//   }

//   if (!FREELANCER.firebase_id) {
//     this.logger.error('FreelancerService: login : Freelancer is not verified');
//     throw new BadRequestError('Freelancer is not verified', ERROR_CODES.EMAIL_NOT_VERIFIED);
//   }

//   const [customToken] = await Promise.all([
//     firebaseClient.generateCustomToken(FREELANCER.firebase_id),
//     // this.userSubscriptionDAO.getSubscriptionByFreelancerId(FREELANCER.id),
//   ]);

//   return {
//     firebase_custom_token: customToken,
//     user_id: FREELANCER.id,
//     user_name: FREELANCER.full_name,
//     email: FREELANCER.email,
//     subscription: subscription?.entity_plan,
//   };
// }

// /**
//  * Service method to register a new FREELANCER
//  * @param body
//  * @param em
//  * @returns
//  */
// async register(body: FreelancerRegistrationBody) {
//   const { full_name: fullName, email: workEmail, password } = body;

//   let FREELANCER: any = await this.freelancerDAO.findOneByEmail(workEmail);

//   if (FREELANCER?.owner_id) {
//     this.logger.error('Staff members are not allowed to proceed');

//     throw new BadRequestError(
//       RESPONSE_MESSAGE.STAFF_REGISTERATION_NOT_ALLOWED,
//       ERROR_CODES.STAFF_REGISTERATION_NOT_ALLOWED,
//     );
//   } else if (FREELANCER?.is_email_verified) {
//     this.logger.error('Verified owners are not allowed to proceed');

//     throw new BadRequestError(RESPONSE_MESSAGE.VERIFIED_OWNERS_NOT_ALLOWED, ERROR_CODES.USER_ALREADY_REGISTERED);
//   }

//   if (!FREELANCER) {
//     const hashedPassword = await hashPassword(password);
//     FREELANCER = {
//       id: uuidv4(),
//       full_name: fullName,
//       email: workEmail,
//       password: hashedPassword,
//       is_email_verified: false
//     };

//     await this.freelancerDAO.create(this.freelancerDAO.model, FREELANCER)
//   }

//   const jwtToken = jwtSign({ id: FREELANCER!.id }, JWT_SECRET_KEY, { expiresIn: '7d' });
//   const encryptedJwt = await encrypt(jwtToken, ENCRYPTION_SECRET_KEY);
//   const verificationLink = `${VERIFICATION_DOMAIN}?token=${encryptedJwt}`;

//   this.logger.info(`FreelancerService: register: id: ${FREELANCER!.id} and  Verification link: ${verificationLink}`);

//   const { SENDER, SUBJECT, TEXTBODY } = EMAIL_VERIFICATION_EMAIL_CONSTANTS;
//   await this.sesService.sendEmail({
//     sender: SENDER!,
//     recipient: [workEmail],
//     subject: SUBJECT,
//     textBody: TEXTBODY.replace(':verificationLink', verificationLink),
//   });

//   return verificationLink;
// }
// }
