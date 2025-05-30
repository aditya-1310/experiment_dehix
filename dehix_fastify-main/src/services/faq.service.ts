import { Service, Inject } from "fastify-decorators";
import { BaseService } from "../common/base.service";
import { NotFoundError } from "../common/errors";
import { ERROR_CODES, RESPONSE_MESSAGE } from "../common/constants";
import { FaqDAO } from "../dao";
import { SupportTagsDao } from "../dao/supporttags.dao";

// FaqService class to interact with the database
@Service()
export class FaqService extends BaseService {
  @Inject(FaqDAO)
  private FaqDAO!: FaqDAO;

  @Inject(SupportTagsDao)
  private SupportTagsDao!: SupportTagsDao;

  // Method to create a new faq
  async create(body: any) {
    try {
      const faq: any = await this.FaqDAO.createFaq(body);
      for (const tag of body.supportTags) {
        await this.SupportTagsDao.incrementCountById(tag.tagId);
      }
      return faq;
    } catch (error: any) {
      throw new Error(RESPONSE_MESSAGE.SERVER_ERROR);
    }
  }

  // Method to delete a faq by id
  async deleteFaqById(faq_id: string) {
    this.logger.info(
      `FaqService: deleteFaqById: Deleting FAQ for Faq ID:${faq_id}`,
    );

    // Check if the faq exists
    const checkFaq = await this.FaqDAO.findFaq(faq_id);
    if (!checkFaq) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }
    // Delete the faq
    const deleteFaq = await this.FaqDAO.deleteFaq(faq_id);

    return deleteFaq;
  }

  // Method to find a faq by id
  async getAllFaqs(
    filters: Record<string, string[]>,
    page: string,
    limit: string,
  ) {
    this.logger.info("FaqService: getAllFaqs: Fetching All Faqs ");

    const faqs: any = await this.FaqDAO.getAllFaqs(filters, page, limit);

    return faqs;
  }

  // Method to find a faq by id
  async updateFaqById(faq_id: string, body: any) {
    this.logger.info(
      `FaqService: updateFaqById: Updating FAQ for Faq ID:${faq_id}`,
    );

    // Check if the faq exists
    const checkFaq = await this.FaqDAO.findFaq(faq_id);
    if (!checkFaq) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }

    // Update the faq
    const data = await this.FaqDAO.updateFaq(faq_id, body);

    return data;
  }

  async updateFaqStatus(faq_id, status) {
    try {
      const result = await this.FaqDAO.updateFaqStatus(faq_id, status);

      if (!result) {
        throw new Error("Failed to update the faq status. No faq found.");
      }

      return { message: `Faq status updated to ${status}` };
    } catch (error) {
      console.log(error);
    }
  }

  async getFaqsByTag(tagNames: string[]) {
    try {
      this.logger.info(
        "FaqService: getFaqsByTag: Fetching All Faqs by support tags",
      );

      const faqs: any = await this.FaqDAO.getFaqsByTags(tagNames);
      if (!faqs) {
        throw new NotFoundError(
          RESPONSE_MESSAGE.NOT_FOUND("faqs"),
          ERROR_CODES.NOT_FOUND,
        );
      }
      return faqs;
    } catch (error) {
      console.log(error);
    }
  }
}
