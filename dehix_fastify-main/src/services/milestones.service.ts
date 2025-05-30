import { Service, Inject } from "fastify-decorators";
import { BaseService } from "../common/base.service";
import { MilestonesDAO } from "../dao/milestone.doa";
import { IMilestone, MilestoneStatus } from "../models/milestones.entity";
import { NotFoundError } from "../common/errors";
import { ERROR_CODES, RESPONSE_MESSAGE } from "../common/constants";

@Service()
export class MilestonesService extends BaseService {
  @Inject(MilestonesDAO)
  private MilestonesDAO!: MilestonesDAO;

  async createMilestone(milestone: IMilestone) {
    this.logger.info(
      `MilestonesService -> createMilestone -> Creating a new milestone with data: ${JSON.stringify(milestone)}`,
    );
    try {
      const createdMilestone =
        await this.MilestonesDAO.createMilestone(milestone);
      this.logger.info(
        `MilestonesService -> createMilestone -> Milestone created successfully with ID: ${createdMilestone._id}`,
      );
      return createdMilestone;
    } catch (error: any) {
      this.logger.error(
        `MilestonesService -> createMilestone -> Error: ${error.message}`,
      );
      throw error;
    }
  }

  async getMilestones({ projectId }: { projectId: string }) {
    try {
      const milestones =
        await this.MilestonesDAO.getMilestonesByUserId(projectId);
      this.logger.info(
        `MilestonesService -> getMilestones -> Milestones fetched successfully`,
      );
      return milestones;
    } catch (error: any) {
      this.logger.error(
        `MilestonesService -> getMilestones -> Error: ${error.message}`,
      );
      throw error;
    }
  }

  async updateTaskAndFreelancers(
    milestoneId: string,
    storyId: string,
    taskId: string,
    updatePermissionFreelancer: boolean,
    updatePermissionBusiness: boolean,
    acceptanceBusiness: boolean,
    acceptanceFreelancer: boolean,
  ) {
    this.logger.info(
      `MilestonesService -> updateTaskAndFreelancers -> Updating task with ID: ${taskId} in milestone ID: ${milestoneId}`,
    );
    try {
      const updatedMilestone = await this.MilestonesDAO.updateTaskFreelancers(
        milestoneId,
        storyId,
        taskId,
        updatePermissionFreelancer,
        updatePermissionBusiness,
        acceptanceBusiness,
        acceptanceFreelancer,
      );
      this.logger.info(
        `MilestonesService -> updateTaskAndFreelancers -> Task updated successfully`,
      );
      return updatedMilestone;
    } catch (error: any) {
      this.logger.error(
        `MilestonesService -> updateTaskAndFreelancers -> Error: ${error.message}`,
      );
      throw error;
    }
  }

  async updateTaskDetails(
    milestoneId: string,
    storyId: string,
    taskId: string,
    title: string,
    summary: string,
    taskStatus: MilestoneStatus,
  ) {
    this.logger.info(
      `MilestonesService -> updateTaskAndFreelancers -> Updating task with ID: ${taskId} in milestone ID: ${milestoneId}`,
    );
    try {
      const updatedMilestone = await this.MilestonesDAO.updateTaskDetails(
        milestoneId,
        storyId,
        taskId,
        title,
        summary,
        taskStatus,
      );
      this.logger.info(
        `MilestonesService -> updateTaskAndFreelancers -> Task updated successfully`,
      );
      return updatedMilestone;
    } catch (error: any) {
      this.logger.error(
        `MilestonesService -> updateTaskAndFreelancers -> Error: ${error.message}`,
      );
      throw error;
    }
  }

  async deleteMilestoneById(milestoneId: string) {
    this.logger.info(
      `MilestonesService -> deleteMilestoneById -> Deleting milestone with ID: ${milestoneId}`,
    );
    try {
      const deletedMilestone =
        await this.MilestonesDAO.deleteMilestoneById(milestoneId);
      if (deletedMilestone) {
        this.logger.info(
          `MilestonesService -> deleteMilestoneById -> Milestone deleted successfully`,
        );
      } else {
        this.logger.info(
          `MilestonesService -> deleteMilestoneById -> Milestone not found for ID: ${milestoneId}`,
        );
      }
      return deletedMilestone;
    } catch (error: any) {
      this.logger.error(
        `MilestonesService -> deleteMilestoneById -> Error: ${error.message}`,
      );
      throw error;
    }
  }

  async updateMilestoneById(
    milestoneId: string,
    milestoneData: Partial<IMilestone>,
  ): Promise<IMilestone | null> {
    this.logger.info(
      `MilestonesService -> updateMilestoneById -> Updating milestone with ID: ${milestoneId} and data: ${JSON.stringify(milestoneData)}`,
    );

    try {
      const existingMilestone =
        await this.MilestonesDAO.findMilestoneById(milestoneId);

      if (!existingMilestone) {
        this.logger.info(
          `MilestonesService -> updateMilestoneById -> Milestone not found for ID: ${milestoneId}`,
        );
        throw new NotFoundError(
          RESPONSE_MESSAGE.DATA_NOT_FOUND,
          ERROR_CODES.NOT_FOUND,
        );
      }

      const updatedMilestone = await this.MilestonesDAO.updateMilestoneById(
        milestoneId,
        milestoneData,
      );

      if (!updatedMilestone) {
        this.logger.error(
          `MilestonesService -> updateMilestoneById -> Update failed for milestone ID: ${milestoneId}`,
        );
        throw new Error(RESPONSE_MESSAGE.USER_NOT_FOUND);
      }

      this.logger.info(
        `MilestonesService -> updateMilestoneById -> Milestone updated successfully`,
      );
      return updatedMilestone;
    } catch (error: any) {
      this.logger.error(
        `MilestonesService -> updateMilestoneById -> Error: ${error.message}`,
      );
      throw error;
    }
  }
}
