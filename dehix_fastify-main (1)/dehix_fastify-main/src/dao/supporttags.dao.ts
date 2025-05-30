import { Service } from "fastify-decorators";
import SupportTagsModel, { ISupportTag } from "../models/supporttags.entity";
import { BaseDAO } from "../common/base.dao";
import { Model } from "mongoose";

@Service()
export class SupportTagsDao extends BaseDAO {
  model: Model<ISupportTag>;
  constructor() {
    super();
    this.model = SupportTagsModel;
  }
  async createSupportTags(tag: any) {
    return await this.model.create(tag);
  }

  async findSupportTagById(tagId: string) {
    return await this.model.findById(tagId);
  }

  async getAllSupportTags() {
    try {
      const tags = await this.model.find();
      if (tags.length === 0) {
        throw new Error("No support tags found");
      }
      return tags;
    } catch (error: any) {
      throw new Error(`Failed to fetch support tags: ${error.message}`);
    }
  }

  async getSupportTagById(tagId: string) {
    return await this.model.findById(tagId);
  }

  async updateSupportTagById(tagId: string, updateData: any) {
    return await this.model.findByIdAndUpdate(tagId, updateData, {
      new: true,
    });
  }

  async deleteSupportTagById(tagId: string) {
    return await this.model.findByIdAndDelete(tagId);
  }

  async incrementCountById(tagId: string) {
    return await this.model.findByIdAndUpdate(
      tagId,
      { $inc: { count: 1 } },
      { new: true },
    );
  }
}
