import { Service } from "fastify-decorators";
import { Model } from "mongoose";
import { BaseDAO } from "../common/base.dao";
import {
  IFreelancer,
  FreelancerModel,
  FreelancerStatusEnum,
  FreelancerOracleNdConsultantStatusEnum,
  KycStatusEnum,
} from "../models/freelancer.entity";
import { v4 as uuidv4 } from "uuid";
import ApplicationForWorkModel, {
  IApplicationForWork,
} from "../models/applyforwork.entity";
import { fetchDataWithQueries } from "../common/utils";

@Service()
export class FreelancerDAO extends BaseDAO {
  model: Model<IFreelancer>;
  applicationmodel: Model<IApplicationForWork>;
  constructor() {
    super();
    this.model = FreelancerModel;
    this.applicationmodel = ApplicationForWorkModel;
  }

  async getFreelancerByEmail(email: string) {
    return this.model.findOne({ email });
  }

  async findOneByEmail(email: string) {
    return this.model.findOne(
      { email },
      "id password firebase_id full_name email is_email_verified owner_id",
    );
  }

  async addConnect(userId: string) {
    const user = await this.model.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.connects) {
      user.connects = 0;
    }
    user.connects += 100;

    await user.save({ validateBeforeSave: false });
    return user;
  }

  async getById(id: string) {
    return this.model.findById(
      id,
      "id firebase_id full_name email is_email_verified owner_id",
    );
  }

  async findProject(freelancer_id: string, project_id: string) {
    return this.model.findOne({
      _id: freelancer_id,
      projects: { $elemMatch: { project_id: project_id } },
    });
  }

  async updateFreelancer(condition: any, newData: any) {
    return this.model.updateOne(condition, newData);
  }

  async findFreelancerById(id: string) {
    return this.model.findById(id);
  }

  async findFreelancerByUsername(username: string) {
    return this.model.findOne({ userName: username });
  }

  async updateFreelancerData(id: string, update: any) {
    return this.model.findByIdAndUpdate({ _id: id }, update);
  }
  async findAllFreelancers(
    filters: Record<string, string[]>,
    page: string = "1",
    limit: string = "20",
  ) {
    return await fetchDataWithQueries(this.model, filters, page, limit);
  }

  async addFreelancerSkill(id: string, skills: any) {
    const skillsWithId = skills.map((skill: any) => ({
      ...skill,
      _id: uuidv4(),
    }));

    const result = await this.model.updateOne(
      { _id: id },
      { $addToSet: { skills: { $each: skillsWithId } } },
      { new: true, projection: { skills: 1 } },
    );
    if (!result) {
      throw new Error("Freelancer not found or skills could not be added");
    }
    const skillIds = skillsWithId.map((skill: any) => skill._id);
    return {
      skillIds,
      skillsWithId,
    };
  }

  async findDomainExistInFreelancer(freelancer_id: string, domain_id: any) {
    return this.model.findOne({
      _id: freelancer_id,
      domain: { $elemMatch: { _id: domain_id } },
    });
  }
  async findSkillExistInFreelancer(freelancer_id: string, skill_id: any) {
    return this.model.findOne({
      _id: freelancer_id,
      skills: { $elemMatch: { _id: skill_id } },
    });
  }
  async sendFreelancerInfo(id: string) {
    return this.model
      .findById(id, "id firebase_id full_name email is_email_verified owner_id")
      .populate("project")
      .populate("pendingProject")
      .populate("rejectedProject")
      .populate("acceptedProject");
  }
  // async addExperienceById(id: string, update: any, experinceid: string) {
  //   return this.model.findByIdAndUpdate(id, {
  //     $addToSet: {
  //       professional_info: { _id: experinceid, ...update },
  //     },
  //   });
  // }
  // async deleteExperienceById(id: string, experinceid: string) {
  //   return this.model.findByIdAndDelete(id, {
  //     $pull: {
  //       professionalInfo: { _id: experinceid },
  //     },
  //   });
  // }

  async deleteProjectById(id: string, project_id: string) {
    return this.model.findByIdAndUpdate(
      id,
      { $unset: { [`projects.${project_id}`]: "" } },
      { new: true },
    );
  }

  async createFreelancer(freelancer: IFreelancer) {
    try {
      const createdFreelancer = await this.model.create(freelancer);
      return createdFreelancer;
    } catch (error: any) {
      throw new Error(`Failed to add freelancer: ${error.message}`);
    }
  }
  async updatePendingProjectById(freelancer_id: string, project_id: string) {
    return this.model.findByIdAndUpdate(
      freelancer_id,
      { $addToSet: { pendingProject: project_id } },
      { new: true },
    );
  }
  async updateProjectByIdToAccept(freelancer_id: string, project_id: string) {
    return this.model.findByIdAndUpdate(
      freelancer_id,
      {
        $pull: { pendingProject: project_id },
        $addToSet: { acceptedProject: project_id },
      },
      { new: true },
    );
  }
  async updateProjectByIdToReject(freelancer_id: string, project_id: string) {
    return this.model.findByIdAndUpdate(
      freelancer_id,
      {
        $pull: { pendingProject: project_id },
        $addToSet: { rejectedProject: project_id },
      },
      { new: true },
    );
  }
  async creatJobApplication(data: any) {
    return this.applicationmodel.create(data);
  }
  async findJobApplicationById(application_id: string) {
    return this.applicationmodel.findById(application_id);
  }
  async updateJobApplicationStatusById(application_id: string, status: string) {
    return this.applicationmodel.findByIdAndUpdate(
      application_id,
      { status: status },
      { new: true },
    );
  }

  async addDomainById(id: string, domain: any) {
    return this.model.updateOne(
      { _id: id },
      { $addToSet: { domain: { $each: domain } } },
    );
  }

  async updateOracleStatusById(
    freelancer_id: string,
    oracleStatus: FreelancerOracleNdConsultantStatusEnum,
  ) {
    return this.model.findByIdAndUpdate(
      freelancer_id,
      { oracleStatus },
      { new: true },
    );
  }

  async interviewsAlignedById(
    freelancer_id: string,
    interviewsAligned: string[],
  ) {
    return this.model.findByIdAndUpdate(
      freelancer_id,
      { interviewsAligned },
      { new: true },
    );
  }

  async addExperienceById(id: string, update: any) {
    const experienceId = uuidv4();
    const result = await this.model.findByIdAndUpdate(
      id,
      {
        $set: {
          [`professionalInfo.${experienceId}`]: {
            _id: experienceId,
            ...update,
          },
        },
      },
      { new: true, upsert: true },
    );

    return {
      experienceId,
      result,
    };
  }
  async updateExperienceVerification(
    id: string,
    document_id: string,
    update: any,
  ) {
    return await this.model.findByIdAndUpdate(
      id,
      {
        $set: {
          [`professionalInfo.${document_id}`]: {
            ...update,
          },
        },
      },
      { new: true, upsert: true },
    );
  }

  async deleteExperienceById(id: string, experienceId: string) {
    return this.model.findByIdAndUpdate(
      id,
      {
        $unset: {
          [`professionalInfo.${experienceId}`]: "",
        },
      },
      { new: true },
    );
  }

  async putExperienceById(
    freelancerId: string,
    experienceId: string,
    update: any,
  ) {
    return this.model.findOneAndUpdate(
      {
        _id: freelancerId,
        [`professionalInfo.${experienceId}`]: { $exists: true },
      },
      {
        $set: {
          [`professionalInfo.${experienceId}`]: {
            _id: experienceId,
            ...update,
          },
        },
      },
      { new: true },
    );
  }

  async getExperienceById(freelancerId: string, experienceId: string) {
    return this.model.findOne(
      {
        _id: freelancerId,
        [`professionalInfo.${experienceId}`]: { $exists: true },
      },
      { [`professionalInfo.${experienceId}`]: 1 },
    );
  }
  async updateEducationVerification(
    id: string,
    document_id: string,
    update: any,
  ) {
    return this.model.findOneAndUpdate(
      { _id: id, [`education.${document_id}`]: { $exists: true } },
      {
        $set: { [`education.${document_id}`]: { ...update } },
      },
      { new: true },
    );
  }

  async getEducationById(freelancerId: string, educationId: string) {
    return this.model.findOne(
      { _id: freelancerId, [`education.${educationId}`]: { $exists: true } },
      { [`education.${educationId}`]: 1 },
    );
  }

  async addEducationById(id: string, update: any) {
    const educationId = uuidv4();
    const result = await this.model.findByIdAndUpdate(
      id,
      {
        $set: {
          [`education.${educationId}`]: { _id: educationId, ...update },
        },
      },
      { new: true, upsert: true },
    );

    return {
      educationId,
      result,
    };
  }

  async putEducationById(
    freelancerId: string,
    educationId: string,
    update: any,
  ) {
    return this.model.findOneAndUpdate(
      { _id: freelancerId, [`education.${educationId}`]: { $exists: true } },
      {
        $set: { [`education.${educationId}`]: { _id: educationId, ...update } },
      },
      { new: true },
    );
  }

  async deleteEducationById(id: string, educationId: string) {
    return this.model.findByIdAndUpdate(
      id,
      {
        $unset: {
          [`education.${educationId}`]: "",
        },
      },
      { new: true },
    );
  }

  async addProjectById(id: string, update: any) {
    const projectId = uuidv4();
    const result = await this.model.findByIdAndUpdate(
      id,
      {
        $set: {
          [`projects.${projectId}`]: { _id: projectId, ...update },
        },
      },
      { new: true, upsert: true },
    );

    return {
      projectId,
      result,
    };
  }

  async getProjectById(freelancerId: string, project_id: string) {
    return this.model.findOne(
      { _id: freelancerId, [`projects.${project_id}`]: { $exists: true } },
      { [`projects.${project_id}`]: 1 },
    );
  }
  async putProjectVerification(
    freelancer_id: string,
    project_id: string,
    update: any,
  ) {
    return this.model.findOneAndUpdate(
      { _id: freelancer_id, [`projects.${project_id}`]: { $exists: true } },
      {
        $set: { [`projects.${project_id}`]: { ...update } },
      },
      { new: true },
    );
  }
  async putProjectById(freelancer_id: string, project_id: string, update: any) {
    return this.model.findOneAndUpdate(
      { _id: freelancer_id, [`projects.${project_id}`]: { $exists: true } },
      {
        $set: { [`projects.${project_id}`]: { _id: project_id, ...update } },
      },
      { new: true },
    );
  }

  async interviewStatusUpdate(id: string, update: string) {
    return this.model.findByIdAndUpdate(id, { interviewee: update });
  }


  async getAllDehixInteviewers() {
    return await this.model.find({
      dehixInterviewer: { $exists: true, $ne: null },
    });
  }

  async getDehixInterviewer(interviewerId: string) {
    return await this.model.findOne(
      { _id: interviewerId },
      { dehixInterviewer: 1, _id: 0 },
    );
  }

  async addDehixInterviewerById(id: string, update: any) {
    const dehixInterviewerId = uuidv4(); // Generate a unique ID for dehixInterviewer
    const updatedFreelancer = await this.model.findByIdAndUpdate(
      id,
      {
        $set: {
          [`dehixInterviewer.${dehixInterviewerId}`]: {
            _id: dehixInterviewerId,
            ...update,
          },
        },
      },
      { new: true, upsert: true }, // Return the new document after update
    );

    // Return the newly created dehixInterviewer entry
    return updatedFreelancer?.dehixInterviewer?.get(dehixInterviewerId);
  }

  async addFreelancerDomain(id: string, domains: any) {
    const domainsWithId = domains.map((domain) => ({
      ...domain,
      _id: uuidv4(),
    }));
    const result = await this.model.updateOne(
      { _id: id },
      { $addToSet: { domain: { $each: domainsWithId } } },
      { new: true, projection: { domains: 1 } },
    );
    if (!result) {
      throw new Error("Freelancer not found or domains could not be added");
    }
    const domainIds = domainsWithId.map((domain) => domain._id);
    return {
      domainIds,
      domainsWithId,
    };
  }

  async getFreelancerOwnProjects(freelancer_id: string) {
    try {
      return await this.model.find(
        { _id: freelancer_id },
        { projects: 1, _id: 0 },
      );
    } catch (error) {
      console.error("Error fetching freelancer projects:", error);
      throw error;
    }
  }

  async getFreelancerSkills(freelancer_id: string) {
    try {
      return await this.model.find(
        { _id: freelancer_id },
        { skills: 1, _id: 0 },
      );
    } catch (error) {
      console.error("Error fetching freelancer skills:", error);
      throw error;
    }
  }

  async getFreelancerDomains(freelancer_id: string) {
    try {
      return await this.model.find(
        { _id: freelancer_id },
        { domain: 1, _id: 0 },
      );
    } catch (error) {
      console.error("Error fetching freelancer domains:", error);
      throw error;
    }
  }

  async addDehixTalentById(id: string, update: any) {
    const dehixTalentId = uuidv4(); // Generate a unique ID for dehixTalent
    const updatedFreelancer = await this.model.findByIdAndUpdate(
      id,
      {
        $set: {
          [`dehixTalent.${dehixTalentId}`]: {
            _id: dehixTalentId,
            ...update,
          },
        },
      },
      { new: true, upsert: true }, // Return the new document after update
    );

    // Return the newly created dehixTalent entry
    return updatedFreelancer?.dehixTalent?.get(dehixTalentId);
  }

  async getDehixTalentById(freelancerId: string, dehixTalent_id: string) {
    return this.model.findOne(
      {
        _id: freelancerId,
        [`dehixTalent.${dehixTalent_id}`]: { $exists: true },
      },
      { [`dehixTalent.${dehixTalent_id}`]: 1 },
    );
  }

  async deleteDehixTalentById(id: string, dehixTalentId: string) {
    return this.model.findByIdAndUpdate(
      id,
      {
        $unset: {
          [`dehixTalent.${dehixTalentId}`]: 1,
        },
      },
      { new: true },
    );
  }

  async putConsultant(
    freelancer_id: string,
    consultant_id: string,
    update: any,
  ) {
    return this.model.findByIdAndUpdate(
      {
        _id: freelancer_id,
        [`consultant.${consultant_id}`]: { $exists: true },
      },
      { $set: { [`consultant.${consultant_id}`]: { ...update } } },
    );
  }

  async addConsultant(freelancer_id: string, update: any) {
    const consultant_id = uuidv4();
    return this.model.findByIdAndUpdate(
      freelancer_id,
      {
        $set: {
          [`consultant.${consultant_id}`]: { _id: consultant_id, ...update },
        },
      },
      { new: true, upsert: true },
    );
  }
  async getConsultantById(freelancer_id: string, consultant_id: string) {
    return this.model.findOne({
      _id: freelancer_id,
      [`consultant.${consultant_id}`]: { $exists: true },
    });
  }
  async getConsultant(freelancer_id: string, consultant_id: string) {
    return this.model
      .findOne({ _id: freelancer_id }, { [`consultant.${consultant_id}`]: 1 })
      .lean(); // Return a plain JS object instead of a Mongoose document(Map -> plain object)
  }
  async updateConsultant(
    freelancer_id: string,
    consultant_id: string,
    update: any,
  ) {
    return this.model.findByIdAndUpdate(
      {
        _id: freelancer_id,
        [`consultant.${consultant_id}`]: { $exists: true },
      },
      { $set: { [`consultant.${consultant_id}`]: { ...update } } },
      {
        new: true,
      },
    );
  }
  async deleteConsultant(freelancer_id: string, consultant_id: string) {
    return this.model.findByIdAndUpdate(
      freelancer_id,
      { $unset: { [`consultant.${consultant_id}`]: "" } },
      { new: true },
    );
  }
  async findOracle(requester_id: string) {
    const freelancer = await this.model
      .aggregate([
        {
          $match: {
            oracleStatus: "approved",
          },
        },
        {
          $lookup: {
            from: "verifications",
            localField: "_id",
            foreignField: "verifier_id",
            as: "verifications",
          },
        },
        {
          // Exclude the freelancer whose _id matches the requester_id
          $match: {
            _id: { $ne: requester_id },
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

    if (!freelancer || freelancer.length === 0) {
      return null;
    }

    // Return the freelancer object with id and username
    return {
      id: freelancer[0]._id,
      username: freelancer[0].userName,
    };
  }

  async getSkillById(freelancerId: string, skillId: string) {
    return this.model.findOne(
      { _id: freelancerId, "skills._id": skillId }, // Use dot notation to match subdocument _id
      { "skills.$": 1 }, // Use $ to project only the matching element in the array
    );
  }

  async getDomainById(freelancerId: string, domainId: string) {
    return this.model.findOne(
      { _id: freelancerId, "domain._id": domainId }, // Use dot notation to match subdocument _id
      { "domain.$": 1 }, // Use $ to project only the matching element in the array
    );
  }
  async updateNotInterestedProject(freelancer_id: string, project_id: string) {
    return this.model.findByIdAndUpdate(
      freelancer_id,
      {
        $addToSet: { notInterestedProject: project_id },
      },
      { new: true },
    );
  }

  async changeOracleStatus(verifier_id: string) {
    try {
      await this.model.findByIdAndUpdate(verifier_id, {
        oracleStatus: "stopped",
      });
    } catch (error: any) {
      throw new Error(
        `Unable to update oracleStatus to 'stopped': ${error.message}`,
      );
    }
  }

  async getAllDehixTalent(limit: number, skip: number) {
    try {
      // Fetch freelancers who have dehixTalent
      const freelancers = await this.model
        .find({ dehixTalent: { $exists: true, $ne: {} } })
        .select(
          "_id firstName lastName userName profilePic dehixTalent education projects",
        )
        .lean()
        .exec();

      const allTalents = freelancers.flatMap((freelancer: any) =>
        Object.keys(freelancer.dehixTalent).map((talentId) => {
          const talentData = {
            freelancer_id: `${freelancer._id}`,
            Name: `${freelancer.firstName} ${freelancer.lastName}`,
            userName: `${freelancer.userName}`,
            profilePic: `${freelancer.profilePic}`,
            dehixTalent: {
              _id: talentId,
              ...freelancer.dehixTalent[talentId],
            },
          };

          if (freelancer.education && freelancer.projects) {
            return {
              ...talentData,
              education: freelancer.education,
              projects: freelancer.projects,
            };
          }

          return talentData;
        }),
      );

      // Apply the pagination (limit and skip) on the flattened talents
      const paginatedTalents = allTalents.slice(skip, skip + limit);

      return paginatedTalents; // Return the paginated talents
    } catch (error: any) {
      throw new Error(`Failed to fetch dehix talent: ${error.message}`);
    }
  }

  async getFreelancerDehixTalent(freelancer_id: string) {
    try {
      return await this.model.find(
        { _id: freelancer_id },
        { dehixTalent: 1, _id: 1 },
      );
    } catch (error) {
      console.error("Error fetching freelancer dehix talent:", error);
      throw error;
    }
  }

  async getFreelancerEducation(freelancer_id: string) {
    try {
      const data = await this.model.find(
        { _id: freelancer_id },
        { education: 1, _id: 0 },
      );
      return data;
    } catch (error) {
      console.error("Error fetching freelancer education:", error);
      throw error;
    }
  }

  async getFreelancerByReferralCode(referralCode: string) {
    try {
      return await this.model.findOne({
        "referral.referralCode": referralCode,
      });
    } catch (error) {
      console.error("Error fetching freelancer by referral code:", error);
      throw error;
    }
  }

  async addReferralBonus(referrer_id: string, freelancer_id: string) {
    try {
      // Update the referrer's connects and referral data
      await this.updateFreelancerData(referrer_id, {
        $inc: { connects: 100, "referral.referredCount": 1 }, // Increment the connects and referredCount
        $push: { "referral.referredTo": freelancer_id }, // Add the referred freelancer to the referrer's list
      });
      // Update the referred freelancer's connects and referral data
      await this.updateFreelancerData(freelancer_id, {
        $inc: { connects: 100 }, // Increment the referred freelancer's connects
        $set: { "referral.referredBy": referrer_id }, // Set the referrer's ID in the referred freelancer's data
      });
    } catch (error) {
      console.error("Error adding referral bonus:", error);
      throw error;
    }
  }

  async updateDehixTalent(
    freelancer_id: string,
    dehixTalent_id: string,
    update: { status?: string; activeStatus?: boolean },
  ) {
    const updateData = Object.entries(update).reduce((acc, [key, value]) => {
      acc[`dehixTalent.${dehixTalent_id}.${key}`] = value;
      return acc;
    }, {});

    const updatedTalent = await this.model.findOneAndUpdate(
      {
        _id: freelancer_id,
        [`dehixTalent.${dehixTalent_id}`]: { $exists: true },
      },
      { $set: updateData },
      {
        new: true,
      },
    );
    return updatedTalent?.dehixTalent?.get(dehixTalent_id);
  }

  async getFreelancerConnects(freelancer_id: string) {
    try {
      const freelancer = await this.model.findById(freelancer_id);
      if (!freelancer) {
        throw new Error("Freelancer not found");
      }
      if (freelancer.connects == 0) {
        return (freelancer.connects = 0);
      }
      return freelancer.connects;
    } catch (error: any) {
      throw new Error(`Error fetching freelancer connects: ${error.message}`);
    }
  }

  async updateFreelancerConnects(freelancer_id: string, connects: number) {
    try {
      const updatedFreelancer = await this.model.findByIdAndUpdate(
        freelancer_id,
        { connects: connects },
        { new: true },
      );
      return updatedFreelancer;
    } catch (error: any) {
      throw new Error(`Error updating connects: ${error.message}`);
    }
  }
  async updateFreelancerKyc(
    freelancer_id: string,
    kycDetails: {
      aadharOrGovtId?: string;
      frontImageUrl?: string;
      backImageUrl?: string;
      liveCapture?: string;
      status?: KycStatusEnum;
    },
  ) {
    try {
      // Create an object to store the fields to be updated
      const updateFields = {} as any;

      // Only add the fields that are provided in the kycDetails
      if (kycDetails.aadharOrGovtId !== undefined) {
        updateFields["kyc.aadharOrGovtId"] = kycDetails.aadharOrGovtId;
      }
      if (kycDetails.frontImageUrl !== undefined) {
        updateFields["kyc.frontImageUrl"] = kycDetails.frontImageUrl;
      }
      if (kycDetails.backImageUrl !== undefined) {
        updateFields["kyc.backImageUrl"] = kycDetails.backImageUrl;
      }
      if (kycDetails.liveCapture !== undefined) {
        updateFields["kyc.liveCapture"] = kycDetails.liveCapture;
      }
      if (kycDetails.status !== undefined) {
        updateFields["kyc.status"] = kycDetails.status;
      }

      // Perform the update with only the provided fields
      const updatedFreelancer = await this.model.findByIdAndUpdate(
        freelancer_id,
        { $set: updateFields },
        { new: true },
      );

      // Check if the freelancer was found and return the updated freelancer
      if (!updatedFreelancer) {
        throw new Error("Freelancer not found");
      }

      return updatedFreelancer;
    } catch (error: any) {
      throw new Error(`Failed to update KYC details: ${error.message}`);
    }
  }

  async updateFreelancerOnboardingStatus(
    freelancer_id: string,
    onboardingStatus: string,
  ) {
    return this.model.findByIdAndUpdate(
      freelancer_id,
      { onboardingStatus },
      { new: true },
    );
  }

  async updateStatusOfFreelancer(
    freelancerId: string,
    status: FreelancerStatusEnum,
  ): Promise<IFreelancer | null> {
    try {
      return await this.model
        .findByIdAndUpdate(freelancerId, { status }, { new: true })
        .exec();
    } catch (error) {
      console.error("Error updating freelancer status:", error);
      throw error;
    }
  }

  async getFreelancerByUserName(userName: string) {
    try {
      return await this.model.find({ userName });
    } catch (error: any) {
      throw new Error(`Failed to fetch freelancer data: ${error.message}`);
    }
  }

  async checkDuplicateUserName(username: string) {
    return await this.model.exists({ userName: username });
  }

  /**
   * DAO function to get all freelancer _id where skills._id matches the given skill_id
   * and skills.interviewPermission status is VERIFIED
   * @param {String} skillId - The skill _id to match.
   * @returns {Promise<Array>} - A promise that resolves to an array of freelancer _id's and name's.
   */
  async getskillVerifiersBySkill(skillId: string) {
    try {
      const freelancers = await this.model
        .find({
          "skills._id": skillId,
          "skills.interviewPermission": "VERIFIED",
        })
        .select("_id firstName lastName email");

      // Return the array of freelancer objects with _id and fullName (firstName + lastName)
      return freelancers.map((freelancer) => ({
        _id: freelancer._id,
        fullName: `${freelancer.firstName} ${freelancer.lastName}`, // Concatenate firstName and lastName
        email: freelancer.email,
      }));
    } catch (error: any) {
      throw new Error(`Error fetching freelancers by skill: ${error.message}`);
    }
  }

  async getDomainVerifiersByDomain(domainId: string) {
    try {
      const freelancers = await this.model
        .find({
          "domain._id": domainId,
          "domain.interviewPermission": "VERIFIED",
        })
        .select("_id firstName lastName email");

      // Return the array of freelancer objects with _id and fullName (firstName + lastName)
      return freelancers.map((freelancer) => ({
        _id: freelancer._id,
        fullName: `${freelancer.firstName} ${freelancer.lastName}`, // Concatenate firstName and lastName
        email: freelancer.email,
      }));
    } catch (error: any) {
      throw new Error(`Error fetching freelancers by domain: ${error.message}`);
    }
  }
}
