import { Service } from "fastify-decorators";
import { Model } from "mongoose";
import { BaseDAO } from "../common/base.dao";
import {
  IBusiness,
  BusinessModel,
  BusinessStatusEnum,
  KycBusinessStatusEnum,
} from "../models/business.entity";
import { IProject, ProjectModel } from "../models/project.entity";
import { v4 as uuidv4 } from "uuid";
import { fetchDataWithQueries } from "../common/utils";

@Service()
export class businessDAO extends BaseDAO {
  model: Model<IBusiness>;
  projectmodel: Model<IProject>;
  constructor() {
    super();
    this.model = BusinessModel;
    this.projectmodel = ProjectModel;
  }

  async getBusinessByEmail(email: string) {
    return this.model.findOne({ email });
  }

  async getBusinessById(id: string) {
    return this.model.findOne({ _id: id });
  }
  async populateBusiness(business_id: string) {
    return this.model.findById(business_id).populate("ProjectList").populate({
      path: "hirefreelancer.freelancer",
      model: "Freelancer",
    });
  }

  async getBusinessByReferralCode(referralCode: string) {
    try {
      return await this.model.findOne({
        "referral.referralCode": referralCode,
      });
    } catch (error) {
      console.error("Error fetching freelancer by referral code:", error);
      throw error;
    }
  }

  async updateFreelancerData(id: string, update: any) {
    return this.model.findByIdAndUpdate({ _id: id }, update);
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

  async addReferralBonus(referrer_id: string, freelancer_id: string) {
    try {
      await this.updateFreelancerData(referrer_id, {
        $inc: { connects: 100, "referral.referredCount": 1 },
        $push: { "referral.referredTo": freelancer_id },
      });
      await this.updateFreelancerData(freelancer_id, {
        $inc: { connects: 100 },
        $set: { "referral.referredBy": referrer_id },
      });
    } catch (error) {
      console.error("Error adding referral bonus:", error);
      throw error;
    }
  }

  async findOneByEmail(email: string) {
    return this.model.findOne(
      { email },
      "id password firebase_id full_name email is_email_verified owner_id",
    );
  }
  async createBusiness(data: any) {
    return this.model.create(data);
  }

  async getById(id: string) {
    return this.model.findById(id);
  }

  async updateBusiness(condition: any, newData: any) {
    return this.model.updateOne(condition, newData);
  }

  async findBusinessById(id: string) {
    return this.model.findById(id);
  }

  async updateBusinessData(id: string, update: any) {
    return this.model.updateOne({ _id: id }, update);
  }
  async findAllBusiness(
    filters: Record<string, string[]>,
    page: string = "1",
    limit: string = "20",
  ) {
    return await fetchDataWithQueries(this.model, filters, page, limit);
  }
  async createProjectBusiness(data: any) {
    try {
      const { profiles } = data;
      const updatedProfiles =
        profiles?.map((profile: any) => ({
          _id: uuidv4(),
          ...profile,
        })) || [];

      const projectData = {
        ...data,
        profiles: updatedProfiles,
      };

      return await this.projectmodel.create(projectData);
    } catch (error) {
      console.error("Error creating project:", error);
      throw new Error("Internal Server Error");
    }
  }
  async updateTotalBidProfile(
    bidder_id: string,
    profile_id: string,
    project_id: string,
  ) {
    return this.projectmodel.findOneAndUpdate(
      { _id: project_id, "profiles._id": profile_id },
      {
        $addToSet: {
          "profiles.$.totalBid": bidder_id,
        },
      },
      { new: true },
    );
  }

  async findBusinessProject(id: string) {
    return this.projectmodel.findById(id);
  }
  async updateBusinessProject(id: string, update: any) {
    return this.projectmodel.findByIdAndUpdate(id, update);
  }
  async addProjectById(business_id: string, project_id: string) {
    return this.model.findByIdAndUpdate(
      business_id,
      { $push: { ProjectList: project_id } },
      { new: true },
    );
  }
  async deleteBusinessProject(id: string) {
    return this.projectmodel.findByIdAndDelete(id);
  }

  // async addAppliedCandidateById(business_id: string, candidate_id: string) {
  //   return this.model.findByIdAndUpdate(business_id, {
  //     $addToSet: {
  //       Appliedcandidates: candidate_id,
  //     },
  //   });
  // }

  async addCandidateByCategory(
    project_id: string,
    category: string,
    candidate_id: string,
  ) {
    this.projectmodel.findOneAndUpdate(
      { _id: project_id, "TotalNeedOffreelancer.category": category },
      {
        $addToSet: {
          "TotalNeedOffreelancer.$.appliedCandidates": candidate_id,
        },
      },
      { new: true },
    );
  }
  async updateProjectStatus(project_id: string, category: string) {
    return this.projectmodel.updateOne(
      { _id: project_id, "TotalNeedOffreelancer.category": category },
      { $set: { "TotalNeedOffreelancer.$.status": "not assigned" } },
    );
  }
  async findAllProjects(
    filters: {
      location?: string[];
      jobType?: string[];
      domain?: string[];
      skills?: string[];
      projectDomain?: string[];
    },
    page: string,
    limit: string,
  ) {
    const { location, jobType, domain, skills, projectDomain } = filters;

    // Build the query object based on the provided filters
    const query: any = {};

    if (location && location.length > 0) {
      query.location = { $in: location };
    }

    if (jobType && jobType.length > 0) {
      query.jobType = { $in: jobType };
    }

    // Handling nested fields in profiles array
    if (domain && domain.length > 0) {
      query["profiles.domain"] = { $in: domain };
    }

    if (skills && skills.length > 0) {
      query.skillsRequired = { $in: skills };
    }

    if (projectDomain && projectDomain.length > 0) {
      query.projectDomain = { $in: projectDomain };
    }
    query.status = { $ne: "Completed" };
    const pageIndex: number = parseInt(page) - 1;
    const pageSize: number = parseInt(limit);
    const startIndex = pageIndex * pageSize;
    return await this.projectmodel.find(query).skip(startIndex).limit(pageSize);
  }
  async getProjectById(project_id: string) {
    return this.projectmodel.findById(project_id);
  }

  async updateBusinessStatus(business_id: string, status: BusinessStatusEnum) {
    try {
      return await this.model.findByIdAndUpdate(
        business_id,
        { status, updatedAt: new Date() },
        { new: true },
      );
    } catch (error) {
      console.error("Error updating business status:", error);
      throw new Error("Failed to update business status");
    }
  }

  async updateProjectProfile(
    bidId: string,
    freelancerId: string,
    project_id: string,
    profile_id: string,
  ) {
    const result = await this.projectmodel.updateOne(
      { _id: project_id, "profiles._id": profile_id },
      {
        $addToSet: {
          "profiles.$.freelancers": {
            freelancerId: freelancerId,
            bidId: bidId,
          },
        },
      },
    );

    return result;
  }
  async getBusinessByCompanyName(userName: string) {
    try {
      return await this.model.find({ userName });
    } catch (error: any) {
      throw new Error(`Failed to fetch business data: ${error.message}`);
    }
  }

  async checkDuplicateCompanyName(username: string) {
    return await this.model.exists({ userName: username });
  }

  async updateBusinessKyc(
    business_id: string,
    kycDetails: {
      businessProof: string;
      verification: string;
      frontImageUrl?: string;
      backImageUrl?: string;
      liveCapture?: string;
      status?: KycBusinessStatusEnum;
    },
  ) {
    try {
      // Create an object to store the fields to be updated
      const updateFields = {} as any;

      // Only add the fields that are provided in the kycDetails
      if (kycDetails.businessProof !== undefined) {
        updateFields["kyc.businessProof"] = kycDetails.businessProof;
      }
      if (kycDetails.verification !== undefined) {
        updateFields["kyc.verification"] = kycDetails.verification;
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
      const updatedBusiness = await this.model.findByIdAndUpdate(
        business_id,
        { $set: updateFields },
        { new: true },
      );

      // Check if the Business was found and return the updated Business
      if (!updatedBusiness) {
        throw new Error("Business not found");
      }

      return updatedBusiness;
    } catch (error: any) {
      throw new Error(`Failed to update KYC details: ${error.message}`);
    }
  }

  async createBusinessKyc(business_id: string, body: any) {
    return await this.model.findOneAndUpdate(
      { _id: business_id },
      { $set: { kyc: body } },
      { new: true },
    );
  }

  async updateBusinessConnects(business_id: string, connects: number) {
    try {
      const updatedBusiness = await this.model.findByIdAndUpdate(
        business_id,
        { connects: connects },
        { new: true },
      );
      return updatedBusiness;
    } catch (error: any) {
      throw new Error(`Error updating connects: ${error.message}`);
    }
  }
}
