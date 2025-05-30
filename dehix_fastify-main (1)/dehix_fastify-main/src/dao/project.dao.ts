import { Service } from "fastify-decorators";
import { Model } from "mongoose";
import { BaseDAO } from "../common/base.dao";
import { IProject, ProjectModel, StatusEnum } from "../models/project.entity";
import { fetchDataWithQueries } from "../common/utils";
import { FreelancerModel } from "../models/freelancer.entity";
import { BidModel } from "../models/bid.entity";

@Service()
export class ProjectDAO extends BaseDAO {
  model: Model<IProject>;

  constructor() {
    super();
    this.model = ProjectModel;
  }

  /**
   * Fetches projects associated with a freelancer by user ID.
   * @param userId - ID of the freelancer.
   * @param status - Optional status of the project.
   * @returns List of projects.
   */
  async getFreelancerProjects(
    userId: string,
    status?: StatusEnum,
  ): Promise<IProject[]> {
    try {
      const query = {
        team: { $in: [userId] },
        ...(status && { status }),
      };

      return await this.model.find(query).exec();
    } catch (error) {
      console.error("Error fetching freelancer projects:", error);
      throw error;
    }
  }

  /**
   * Fetches projects for a business by business ID.
   * @param businessId - ID of the business.
   * @param status - Optional status of the projects.
   * @returns List of projects.
   */
  async getBusinessProjectsById(
    businessId: string,
    status?: StatusEnum,
  ): Promise<IProject[]> {
    try {
      const query = {
        companyId: businessId,
        ...(status && { status }),
      };

      return await this.model.find(query).exec();
    } catch (error) {
      console.error("Error fetching business projects:", error);
      throw error;
    }
  }

  /**
   * Fetches a project by its ID.
   * @param projectId - ID of the project.
   * @returns The project document.
   */
  async getProjectById(projectId: string): Promise<IProject | null> {
    try {
      return await this.model.findById(projectId).exec();
    } catch (error) {
      console.error("Error fetching project by ID:", error);
      throw error;
    }
  }

  /**
   * Fetches all projects.
   * @returns List of all projects.
   */
  async getAllProjects(
    filters: Record<string, string[]>,
    page: string = "1",
    limit: string = "20",
  ): Promise<IProject[]> {
    try {
      return await fetchDataWithQueries(this.model, filters, page, limit);
    } catch (error: any) {
      throw new Error(`Failed to fetch all projects: ${error.message}`);
    }
  }

  /**
   * Fetches a specific profile within a project.
   * @param projectId - ID of the project.
   * @param profileId - ID of the profile.
   * @returns The matched profile.
   */
  async getProjectProfileById(
    projectId: string,
    profileId: string,
  ): Promise<IProject | null> {
    try {
      return await this.model
        .findOne(
          { _id: projectId },
          { profiles: { $elemMatch: { _id: profileId } } },
        )
        .exec();
    } catch (error) {
      console.error("Error fetching project profile:", error);
      throw error;
    }
  }

  async getFreelancersByProjectId(projectId: string): Promise<any> {
    try {
      const project = await this.model.findById(projectId).exec();

      if (!project || !project.profiles) {
        return {
          message: `No freelancers found for projectId: ${projectId}`,
          data: [],
        };
      }

      const freelancerIds = project.profiles.flatMap((profile: any) =>
        profile.freelancers.map((freelancer: any) => freelancer.freelancerId),
      );

      const bidIds = project.profiles.flatMap((profile: any) =>
        profile.freelancers.map((freelancer: any) => freelancer.bidId),
      );

      const freelancers = await FreelancerModel.find({
        _id: { $in: freelancerIds },
      }).select("email userName _id role");

      const bids = await BidModel.find({
        _id: { $in: bidIds },
      }).select("current_price _id");

      const bidsMap = new Map(
        bids.map((bid: any) => [bid._id.toString(), bid.current_price]),
      );

      const freelancerData = project.profiles.flatMap((profile: any) =>
        profile.freelancers.map((freelancer: any) => {
          const freelancerDetails = freelancers.find(
            (f: any) => f._id.toString() === freelancer.freelancerId.toString(),
          );
          const bidPrice = bidsMap.get(freelancer.bidId?.toString()) || "N/A";

          return {
            email: freelancerDetails?.email || "N/A",
            userName: freelancerDetails?.userName || "N/A",
            _id: freelancer.freelancerId,
            perHourPrice: bidPrice,
            role: freelancerDetails?.role || "N/A",
          };
        }),
      );

      return {
        message: "Freelancers and bids fetched successfully",
        freelancerData,
      };
    } catch (error: any) {
      throw new Error(
        `Unable to fetch freelancers and bids for projectId: ${projectId}`,
      );
    }
  }

  /**
   * Deletes a specific profile from a project.
   * @param projectId - ID of the project.
   * @param profileId - ID of the profile.
   * @returns The updated project document.
   */
  async deleteProjectProfileById(
    projectId: string,
    profileId: string,
  ): Promise<IProject | null> {
    try {
      return await this.model
        .findOneAndUpdate(
          { _id: projectId },
          { $pull: { profiles: { _id: profileId } } },
          { new: true },
        )
        .exec();
    } catch (error) {
      console.error("Error deleting project profile:", error);
      throw error;
    }
  }

  /**
   * Updates a specific profile within a project.
   * @param projectId - ID of the project.
   * @param profileId - ID of the profile.
   * @param update - Update data for the profile.
   * @returns The updated project document.
   */
  async updateProjectProfileById(
    projectId: string,
    profileId: string,
    update: Partial<IProject>,
  ): Promise<IProject | null> {
    try {
      const updateFields = Object.keys(update).reduce(
        (acc, key) => {
          acc[`profiles.$.${key}`] = update[key];
          return acc;
        },
        {} as Record<string, any>,
      );

      return await this.model
        .findOneAndUpdate(
          { _id: projectId, "profiles._id": profileId },
          { $set: updateFields },
          { new: true },
        )
        .exec();
    } catch (error) {
      console.error("Error updating project profile:", error);
      throw error;
    }
  }

  /**
   * Updates the status of a project.
   * @param projectId - ID of the project.
   * @param status - New status for the project.
   * @returns The updated project document.
   */
  async updateStatus(
    projectId: string,
    status: StatusEnum,
  ): Promise<IProject | null> {
    try {
      return await this.model
        .findByIdAndUpdate(
          projectId,
          { status, updatedAt: new Date() },
          { new: true },
        )
        .exec();
    } catch (error) {
      console.error("Error updating project status:", error);
      throw error;
    }
  }

  /**
   * Fetches a project and its associated bids data.
   * @param projectId - ID of the project.
   * @returns The project document and associated bids.
   */
  async getProjectAndBidsData(projectId: string): Promise<any> {
    try {
      return await this.model
        .aggregate([
          { $match: { _id: projectId } },
          {
            $lookup: {
              from: "bids",
              localField: "_id",
              foreignField: "project_id",
              as: "bids",
            },
          },
        ])
        .exec();
    } catch (error) {
      console.error("Error fetching project and bids data:", error);
      throw error;
    }
  }
  async updateBiddingDate(
    project_id: string,
    maxBiddingDate: Date,
    startBiddingDate: Date,
  ) {
    return await this.model.findByIdAndUpdate(
      project_id,
      { maxBidDate: maxBiddingDate, startBidDate: startBiddingDate },
      { new: true },
    );
  }
}
