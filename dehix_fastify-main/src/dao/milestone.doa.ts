import { Service } from "fastify-decorators";
import MilestoneModel, {
  IMilestone,
  MilestoneStatus,
} from "../models/milestones.entity";
import { BaseDAO } from "../common/base.dao";
import { Model } from "mongoose";
import { ProjectModel } from "../models/project.entity";

@Service()
export class MilestonesDAO extends BaseDAO {
  model: Model<IMilestone>;

  constructor() {
    super();
    this.model = MilestoneModel;
  }

  async updateTaskFreelancers(
    milestoneId: string,
    storyId: string,
    taskId: string, // Freelancer ID to identify the correct freelancer
    updatePermissionFreelancer: boolean,
    updatePermissionBusiness: boolean,
    acceptanceBusiness: boolean,
    acceptanceFreelancer: boolean,
  ) {
    const milestone = await this.model.findById(milestoneId);
    if (!milestone) {
      throw new Error("Milestone not found");
    }

    const story = milestone.stories?.find(
      (story) => story._id.toString() === storyId,
    );
    if (!story) {
      throw new Error("Story not found");
    }

    const task = story.tasks?.find((task) => task._id.toString() === taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    if (!task.freelancers || task.freelancers.length === 0) {
      throw new Error("No freelancers found in the task");
    }

    // Update only the fields passed in the request
    const freelancer = task.freelancers[0];

    freelancer.updatePermissionFreelancer =
      updatePermissionFreelancer !== undefined
        ? updatePermissionFreelancer
        : freelancer.updatePermissionFreelancer;

    freelancer.updatePermissionBusiness =
      updatePermissionBusiness !== undefined
        ? updatePermissionBusiness
        : freelancer.updatePermissionBusiness;

    freelancer.acceptanceBusiness =
      acceptanceBusiness !== undefined
        ? acceptanceBusiness
        : freelancer.acceptanceBusiness;

    freelancer.acceptanceFreelancer =
      acceptanceFreelancer !== undefined
        ? acceptanceFreelancer
        : freelancer.acceptanceFreelancer;

    await milestone.save({ validateBeforeSave: false });

    return milestone;
  }

  async updateTaskDetails(
    milestoneId: string,
    storyId: string,
    taskId: string, // Freelancer ID to identify the correct freelancer
    title: string,
    summary: string,
    taskStatus: MilestoneStatus,
  ) {
    const milestone = await this.model.findById(milestoneId);
    if (!milestone) {
      throw new Error("Milestone not found");
    }

    const story = milestone.stories?.find(
      (story) => story._id.toString() === storyId,
    );
    if (!story) {
      throw new Error("Story not found");
    }

    const task = story.tasks?.find((task) => task._id.toString() === taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    if (!task.freelancers || task.freelancers.length === 0) {
      throw new Error("No freelancers found in the task");
    }

    task.title = title;
    task.summary = summary;
    task.taskStatus = taskStatus;

    task.freelancers.forEach((freelancer) => {
      freelancer.updatePermissionBusiness = false;
      freelancer.updatePermissionFreelancer = false;
      freelancer.acceptanceBusiness = false;
      freelancer.acceptanceFreelancer = false;
    });

    await milestone.save({ validateBeforeSave: false });

    return milestone;
  }

  async createMilestone(milestoneData: Partial<IMilestone>) {
    const milestone = await this.model.create(milestoneData);

    if (milestone.projectId) {
      try {
        await ProjectModel.findByIdAndUpdate(
          milestone.projectId,
          { $push: { milestones: milestone._id } },
          { new: true },
        );
      } catch (error) {
        console.error("Error updating project milestones:", error);
        throw new Error("Failed to update project with new milestone");
      }
    } else {
      console.warn(
        "Milestone does not have a projectId. Skipping project update.",
      );
    }

    return milestone;
  }

  async findMilestoneById(milestoneId: string): Promise<IMilestone | null> {
    return await this.model.findOne({ _id: milestoneId });
  }

  async updateMilestoneById(
    milestoneId: string,
    updateData: Partial<IMilestone>,
  ): Promise<IMilestone | null> {
    console.log(milestoneId);

    const updatedMilestone = await this.model.findOneAndUpdate(
      { _id: milestoneId },
      updateData,
      { new: true },
    );
    if (!updatedMilestone) {
      throw new Error("Milestone not found");
    }
    return updatedMilestone;
  }

  async deleteMilestoneById(milestoneId: string): Promise<IMilestone | null> {
    const milestone = await this.model.findById(milestoneId);

    if (!milestone) {
      throw new Error("Milestone not found");
    }

    if (milestone.projectId) {
      try {
        await ProjectModel.findByIdAndUpdate(
          milestone.projectId,
          { $pull: { milestones: milestone._id } },
          { new: true },
        );
      } catch (error) {
        console.error("Error updating project milestones:", error);
        throw new Error("Failed to update project after deleting milestone");
      }
    }

    return await this.model.findByIdAndDelete(milestoneId);
  }

  async getMilestonesByUserId(projectId: string) {
    if (!projectId) {
      throw new Error("userId is required to fetch milestones.");
    }

    return await this.model.find({ projectId }).lean();
  }
}
