import { Service } from "fastify-decorators";
import { BaseDAO } from "../common/base.dao";
import { Model } from "mongoose";
import ResumeModel, { ResumeDocument } from "../models/resume.entity";

@Service()
export class ResumeDAO extends BaseDAO {
  model: Model<ResumeDocument>;
  constructor() {
    super();
    this.model = ResumeModel;
  }

  // Save a new resume
  async createResume(data: ResumeDocument): Promise<ResumeDocument> {
    const resume = new this.model(data);
    return await resume.save();
  }

  // Fetch resumes by user ID
  async getResumesByUserId(userId: string): Promise<ResumeDocument[]> {
    return await this.model.find({ userId }).exec();
  }

  // Update a resume by ID
  async updateResume(
    resumeId: string,
    updateData: Partial<ResumeDocument>,
  ): Promise<ResumeDocument | null> {
    return await this.model
      .findByIdAndUpdate(resumeId, updateData, { new: true })
      .exec();
  }

  // Delete a resume by ID
  async deleteResume(resumeId: string): Promise<void> {
    await this.model.findByIdAndDelete(resumeId).exec();
  }
}
