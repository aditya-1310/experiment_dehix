import { Service, Inject } from "fastify-decorators";
import { BaseService } from "../common/base.service";
import { SupportTagsDao } from "../dao/supporttags.dao";

@Service()
export class SupportTagsService extends BaseService {
  @Inject(SupportTagsDao)
  private SupportTagsDao!: SupportTagsDao;

  async createSupportTags(tags: any) {
    this.logger.info(
      `SupportTagsService -> createSupportTags -> Creating a new note with data: ${JSON.stringify(tags)}`,
    );
    try {
      const tag = await this.SupportTagsDao.createSupportTags(tags);
      return tag;
    } catch (error: any) {
      this.logger.error(
        `SupportTagsService -> createSupportTags -> Error: ${error.message}`,
      );
      throw error;
    }
  }

  async getAllSupportTags() {
    this.logger.info(
      `SupportTagsService -> GetAllSupportTags -> Fetching all support tags`,
    );
    try {
      const tags = await this.SupportTagsDao.getAllSupportTags();
      return tags;
    } catch (error: any) {
      this.logger.error(
        `SupportTagsService -> GetAllSupportTags -> Error: ${error.message}`,
      );
      throw error;
    }
  }

  async getSupportTagById(tagId: string) {
    this.logger.info(
      `SupportTagsService -> GetSupportTagById -> Fetching support tag for ID ${tagId}`,
    );
    try {
      const tag = await this.SupportTagsDao.getSupportTagById(tagId);
      return tag;
    } catch (error: any) {
      this.logger.error(
        `SupportTagsService -> GetSupportTagById -> Error: ${error.message}`,
      );
      throw error;
    }
  }

  async deleteSupportTagById(tagId: string) {
    this.logger.info(
      `SupportTagsService -> DeleteSupportTagById -> Deleting note with ID: ${tagId}`,
    );
    try {
      const deleteTag = await this.SupportTagsDao.deleteSupportTagById(tagId);
      if (!deleteTag) {
        this.logger.info(
          `SupportTagsService -> DeleteSupportTagById -> Tag not found for ID: ${tagId}`,
        );
      }
      return deleteTag;
    } catch (error: any) {
      this.logger.error(
        `SupportTagsService -> DeleteSupportTagById -> Error: ${error.message}`,
      );
      throw error;
    }
  }

  async updateSupportTagById(tagId: string, tagData: Partial<SupportTagsDao>) {
    this.logger.info(
      `SupportTagsService -> UpdateSupportTagById -> Updating support tag with ID: ${tagId}`,
    );
    try {
      const updatedTag = await this.SupportTagsDao.updateSupportTagById(
        tagId,
        tagData,
      );
      return updatedTag;
    } catch (error: any) {
      this.logger.error(
        `SupportTagsService -> UpdateSupportTagById -> Error: ${error.message}`,
      );
      throw error;
    }
  }
}
