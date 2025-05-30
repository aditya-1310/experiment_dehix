import { Service } from "fastify-decorators";
import { Model } from "mongoose";
import { BaseDAO } from "../common/base.dao";
import { SkillModel, ISkill, SkillStatus } from "../models/skills.entity";
import { v4 as uuidv4 } from "uuid";
import { fetchDataWithQueries } from "../common/utils";

@Service()
export class SkillDAO extends BaseDAO {
  model: Model<ISkill>;

  constructor() {
    super();
    this.model = SkillModel;
  }

  // Count total skills
  async countSkills(): Promise<number> {
    try {
      return this.model.countDocuments(); // Returns the count of skills
    } catch (error: any) {
      throw new Error(`Failed to count skills: ${error.message}`);
    }
  }

  // Add multiple skills
  async addSkills(skillsData: Partial<ISkill>[]) {
    try {
      const insertedSkills = await Promise.all(
        skillsData.map(async (skillData) => {
          const skill = await this.model.create({
            _id: uuidv4(),
            ...skillData,
            createdBy: "admin", // Example, adjust as necessary
            status: SkillStatus.ACTIVE, // Using SkillStatus Enum
          });
          return skill;
        }),
      );
      return insertedSkills;
    } catch (error: any) {
      throw new Error(`Failed to add skills: ${error.message}`);
    }
  }

  // Find skill by ID
  async findSkill(skill_id: string) {
    try {
      return await this.model.findById(skill_id);
    } catch (error: any) {
      throw new Error(`Failed to find skill by ID: ${error.message}`);
    }
  }

  // Get all active skills
  async getAllSkills(
    filters: Record<string, string[]>,
    page: string = "1",
    limit: string = "20",
  ) {
    try {
      return await fetchDataWithQueries(this.model, filters, page, limit);
    } catch (error: any) {
      throw new Error(`Failed to fetch active skills: ${error.message}`);
    }
  }

  // Get all skills (for admin purposes, including inactive or archived)
  async getAllSkillsAdmin() {
    try {
      const skills = await this.model.find();
      return skills;
    } catch (error: any) {
      throw new Error(`Failed to fetch all skills for admin: ${error.message}`);
    }
  }

  // Delete skill by ID
  async deleteSkill(skill_id: string) {
    try {
      return await this.model.findByIdAndDelete(skill_id);
    } catch (error: any) {
      throw new Error(`Failed to delete skill: ${error.message}`);
    }
  }

  // Create a new skill
  async createSkill(data: any) {
    try {
      const prevSkill = await this.model.findOne({ label: data.label });
      if (prevSkill) throw new Error("Skill already present!");
      return await this.model.create(data);
    } catch (error: any) {
      throw new Error(`Failed to create skill: ${error.message}`);
    }
  }

  // Find skill by ID (alternative method)
  async findSkillById(skill_id: string) {
    try {
      return await this.model.findById(skill_id);
    } catch (error: any) {
      throw new Error(`Failed to find skill by ID: ${error.message}`);
    }
  }

  // Update skill by ID
  async updateSkill(id: string, update: any) {
    try {
      return await this.model.findByIdAndUpdate({ _id: id }, update, {
        new: true,
      });
    } catch (error: any) {
      throw new Error(`Failed to update skill: ${error.message}`);
    }
  }
}
