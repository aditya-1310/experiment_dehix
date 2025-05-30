import { Service, Inject } from "fastify-decorators";
import cron from "node-cron";
import { BaseService } from "../common/base.service";
import { VerificationDAO } from "../dao/verifications.dao";
import { NotFoundError } from "../common/errors";
import { ERROR_CODES, RESPONSE_MESSAGE } from "../common/constants";
import { FreelancerDAO } from "../dao/freelancer.dao";
import { AdminDAO } from "../dao/admin.dao";
import { businessDAO } from "../dao/business.dao";

@Service()
export class VerificationService extends BaseService {
  @Inject(VerificationDAO)
  private verificationDAO!: VerificationDAO;
  @Inject(FreelancerDAO)
  private freelancerDAO!: FreelancerDAO;
  @Inject(AdminDAO)
  private adminDAO!: AdminDAO;
  @Inject(businessDAO)
  private BusinessDAO!: businessDAO;

  /**
   * Service method to request a new verification
   * @param doc_id
   * @param doc_type
   * @param requester_id
   * @returns
   */

  constructor() {
    super();

    // Schedule the cron job within the constructor
    cron.schedule("0 * * * *", async () => {
      try {
        const staleVerifications =
          await this.verificationDAO.findStaleVerifications();

        for (const verification of staleVerifications) {
          // Update oracleStatus to stopped of Oracle
          await this.freelancerDAO.changeOracleStatus(verification.verifier_id);

          // find new Oracle
          const newOracle = await this.freelancerDAO.findOracle(
            verification.requester_id,
          );

          if (newOracle) {
            await this.verificationDAO.reassignOracle(
              verification._id,
              newOracle,
            );
          } else {
            throw new Error("newOracle not found");
          }
        }
      } catch (error: any) {
        throw new Error(
          `Error in cron job for oracle reassignment: ${error.message}`,
        );
      }
    });
  }

  async requestVerification(
    doc_id: string,
    doc_type: string,
    requester_id: string,
  ) {
    // Check if the requester exists
    const requesterExist =
      await this.freelancerDAO.findFreelancerById(requester_id);

    if (!requesterExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }

    // Find the verifier
    if (!process.env.ADMIN) {
      const verifier = await this.freelancerDAO.findOracle(requester_id);
      if (!verifier) {
        return;
        // throw new Error("Verifier not found"); // Handle case where no verifier is found
      }

      const verifier_id = verifier.id;
      const verifier_username = verifier.username; // Assuming `username` is the field for verifier's username

      // Create a new verification entry
      const verification = await this.verificationDAO.createOne(
        verifier_id,
        verifier_username,
        requester_id,
        doc_id,
        doc_type,
      );

      return verification;
    } else {
      // call dao function for find admin
      const verifier = await this.adminDAO.findOracle();
      if (!verifier) {
        throw new Error("Verifier not found"); // Handle case where no verifier is found
      }

      const verifier_id = verifier.id;
      const verifier_username = verifier.username; // Assuming `username` is the field for verifier's username

      // Create a new verification entry
      const verification = await this.verificationDAO.createOne(
        verifier_id,
        verifier_username,
        requester_id,
        doc_id,
        doc_type,
      );

      return verification;
    }
  }

  async updateVerificationStatus(
    document_id: string,
    status: string,
    comments: string,
    doc_type: string,
  ) {
    this.logger.info(
      "VerificationService: Updating Verification Status: ",
      document_id,
    );

    const documentExist =
      await this.verificationDAO.findVerificationByDocumentId(document_id);
    if (!documentExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Verification Document"),
        ERROR_CODES.NOT_FOUND,
      );
    }
    this.logger.info(
      "document ",
      documentExist,
      "document id",
      documentExist._id,
    );

    const verificationExist = await this.verificationDAO.findVerificationById(
      documentExist._id,
    );
    if (!verificationExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Verification"),
        ERROR_CODES.NOT_FOUND,
      );
    }

    if (comments) {
      switch (doc_type) {
        case "project":
          await this.updateProjectVerification(
            verificationExist,
            status,
            comments,
          );
          break;

        case "experience":
          await this.updateExperienceVerification(
            verificationExist,
            status,
            comments,
          );
          break;

        case "education":
          await this.updateEducationVerification(
            verificationExist,
            status,
            comments,
          );
          break;

        case "skill":
        case "domain":
          await this.verificationDAO.updateStatus(
            verificationExist._id,
            status,
          );
          break;

        default:
          throw new Error(`Unknown document type: ${doc_type}`);
      }
      // Delete the verification after updating
      return await this.verificationDAO.deleteVerification(documentExist._id);
    }
  }

  private async updateProjectVerification(
    verificationExist: any,
    status: string,
    comments: string,
  ) {
    if (status === "PENDING") {
      await this.freelancerDAO.putProjectVerification(
        verificationExist.requester_id,
        verificationExist.document_id,
        {
          comments,
          verificationStatus: status,
        },
      );
    }
  }

  private async updateExperienceVerification(
    verificationExist: any,
    status: string,
    comments: string,
  ) {
    await this.freelancerDAO.updateExperienceVerification(
      verificationExist.requester_id,
      verificationExist.document_id,
      {
        comments,
        verificationStatus: status,
      },
    );
  }

  private async updateEducationVerification(
    verificationExist: any,
    status: string,
    comments: string,
  ) {
    await this.freelancerDAO.updateEducationVerification(
      verificationExist.requester_id,
      verificationExist.document_id,
      {
        comments,
        verificationStatus: status,
      },
    );
  }

  async deleteVerification(id: string) {
    this.logger.info(`VerificationService: Deleting Verification: ${id}`);

    const verificationExist =
      await this.verificationDAO.findVerificationById(id);

    if (!verificationExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Verification"),
        ERROR_CODES.NOT_FOUND,
      );
    }

    const data = await this.verificationDAO.deleteVerification(id);

    return data;
  }

  async getVerificationData(
    verifier_id: string,
    doc_type:
      | "skill"
      | "domain"
      | "education"
      | "project"
      | "experience"
      | "business",
  ) {
    this.logger.info(
      "VerificationsService: verififetching verification data succesfully",
      verifier_id,
    );

    const verifierExist =
      await this.freelancerDAO.findFreelancerById(verifier_id);
    if (!verifierExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    const data = await this.verificationDAO.getVerificationData(
      verifier_id,
      doc_type,
    );

    if (doc_type == "skill") {
      const requesterData = await Promise.all(
        data.map((doc: any) =>
          this.freelancerDAO.getSkillById(doc.requester_id, doc.document_id),
        ),
      );
      this.logger.info("fetching verification data succesfully");
      return requesterData;
    } else if (doc_type == "domain") {
      const requesterData = await Promise.all(
        data.map((doc: any) =>
          this.freelancerDAO.getDomainById(doc.requester_id, doc.document_id),
        ),
      );
      this.logger.info("fetching verification data succesfully");
      return requesterData;
    } else if (doc_type == "project") {
      const requesterData = await Promise.all(
        data.map((doc: any) =>
          this.freelancerDAO.getProjectById(doc.requester_id, doc.document_id),
        ),
      );
      this.logger.info("fetching verification data succesfully");
      return requesterData;
    } else if (doc_type == "education") {
      const requesterData = await Promise.all(
        data.map((doc: any) =>
          this.freelancerDAO.getEducationById(
            doc.requester_id,
            doc.document_id,
          ),
        ),
      );
      this.logger.info("fetching verification data succesfully");
      return requesterData;
    } else if (doc_type == "experience") {
      const requesterData = await Promise.all(
        data.map((doc: any) =>
          this.freelancerDAO.getExperienceById(
            doc.requester_id,
            doc.document_id,
          ),
        ),
      );
      this.logger.info("fetching verification data succesfully");
      return requesterData;
    } else {
      const requesterData = await Promise.all(
        data.map((doc: any) =>
          this.BusinessDAO.getBusinessById(doc.requester_id),
        ),
      );
      this.logger.info("fetching verification data succesfully");
      return requesterData;
    }
  }

  // Refactor the getAllVerificationData method in VerificationsService
  async getAllVerificationData(
    doc_type?:
      | "skill"
      | "domain"
      | "education"
      | "project"
      | "experience"
      | "business",
    type?: "FREELANCER" | "ADMIN",
  ) {
    this.logger.info(
      `VerificationsService: getAllVerificationData: Fetching verification data for ${doc_type}`,
    );

    const data = await this.verificationDAO.getAllVerificationData(
      doc_type,
      type,
    );

    if (!data || data.length === 0) {
      this.logger.error("No verification data found.");
      return [];
    }

    // Define a mapping between doc_type and corresponding method in freelancerDAO
    const daoMethods = {
      skill: this.freelancerDAO.getSkillById.bind(this.freelancerDAO),
      domain: this.freelancerDAO.getDomainById.bind(this.freelancerDAO),
      project: this.freelancerDAO.getProjectById.bind(this.freelancerDAO),
      education: this.freelancerDAO.getEducationById.bind(this.freelancerDAO),
      experience: this.freelancerDAO.getExperienceById.bind(this.freelancerDAO),
      business: this.BusinessDAO.getBusinessById.bind(this.BusinessDAO),
    };

    // If doc_type is undefined, return all data or handle the case accordingly
    if (!doc_type) {
      return data; // Return all verification data if doc_type is undefined
    }
    if (!daoMethods[doc_type]) {
      throw new Error(`Unsupported doc_type: ${doc_type}`);
    }

    const requesterData = await Promise.all(
      data.map(async (doc: any) => {
        const { verifier_id, verifier_username, requester_id, document_id } =
          doc;
        const result = await daoMethods[doc_type](requester_id, document_id);

        // Handle case when no result is found
        if (!result) {
          this.logger.warn(
            `No result found for ${doc_type} with ID: ${document_id}`,
          );
          return { verifier_id, verifier_username, result: {} };
        }

        return { verifier_id, verifier_username, result };
      }),
    );

    this.logger.info("Fetched verification data successfully.");
    return requesterData;
  }

  async requestBusinessVerification(requester_id: string, doc_type: string) {
    // Check if the requester exists
    const requesterExist =
      await this.BusinessDAO.findBusinessById(requester_id);

    if (!requesterExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.BUSINESS_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }

    // Find the verifier
    const verifier = await this.freelancerDAO.findOracle(requester_id);
    if (!verifier) {
      const verifier = await this.adminDAO.findOracle();
      if (!verifier) {
        throw new Error("Verifier not found");
      }

      const verifier_id = verifier.id;
      const verifier_username = verifier.username; // Assuming `username` is the field for verifier's username

      // Create a new verification entry
      const verification = await this.verificationDAO.createOneBusiness(
        verifier_id,
        verifier_username,
        requester_id,
        doc_type,
      );

      return verification;
    } else {
      const verifier_id = verifier.id;
      const verifier_username = verifier.username; // Assuming `username` is the field for verifier's username

      // Create a new verification entry
      const verification = await this.verificationDAO.createOneBusiness(
        verifier_id,
        verifier_username,
        requester_id,
        doc_type,
      );

      return verification;
    }
  }
  async getVerificationByVerifierId(
    verifier_id: string,
    doc_type?:
      | "skill"
      | "domain"
      | "education"
      | "project"
      | "experience"
      | "business",
  ) {
    this.logger.info(
      `VerificationsService: getAllVerificationData: Fetching verification data for ${verifier_id}`,
    );

    const data = await this.verificationDAO.getVerificationByVerifierId(
      verifier_id,
      doc_type,
    );

    if (!data) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    return data;
  }
  async putCommentInVerification(
    verification_id: string,
    comment: string,
    verifiedAt: Date,
    verification_status: "PENDING" | "APPROVED" | "DENIED",
  ) {
    this.logger.info(
      `VerificationService: updateVerificationById: Updating Verification for Verifier ID:${verification_id}`,
    );
    const verificationexists =
      await this.verificationDAO.getVerificationById(verification_id);
    if (!verificationexists) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }

    const data = await this.verificationDAO.updateVerificationById(
      verification_id,
      comment,
      verifiedAt,
      verification_status,
    );

    return data;
  }

  async increaseConnects(freelancerId, doc_type) {
    const CONNECTS_MAPPING: { [key: string]: number } = {
      business: 10,
      education: 7,
      project: 5,
      experience: 7,
    };

    function getConnectsToAdd(doc_type: string): number {
      return CONNECTS_MAPPING[doc_type] || 0;
    }
    const connectsToAdd = getConnectsToAdd(doc_type);

    const freelancer =
      await this.freelancerDAO.findFreelancerById(freelancerId);
    if (!freelancer) {
      throw new Error("Freelancer not found");
    }

    let currentConnects =
      await this.freelancerDAO.getFreelancerConnects(freelancerId);
    if (!currentConnects) {
      currentConnects = 0;
    }
    const newConnects = currentConnects + connectsToAdd;

    const updatedFreelancer = await this.freelancerDAO.updateFreelancerConnects(
      freelancerId,
      newConnects,
    );

    return updatedFreelancer;
  }
  async getVerificationByID(verification_id: string) {
    this.logger.info(
      `VerificationService: getVerificationById: Getting Verification for ID:${verification_id}`,
    );
    const verificationResult =
      await this.verificationDAO.findVerificationById(verification_id);

    if (!verificationResult) {
      throw new Error(`Verification with ID ${verification_id} not found.`);
    }

    const { doc_type, verifier_id } = verificationResult;
    return { doc_type, verifier_id };
  }
}
