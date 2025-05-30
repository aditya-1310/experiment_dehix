import { Service, Inject } from "fastify-decorators";

import { BaseService } from "../common/base.service";
import { NotFoundError } from "../common/errors";
import { ERROR_CODES, RESPONSE_MESSAGE } from "../common/constants";
import { SkillDAO } from "../dao/skills.dao";

@Service()
export class SkillsService extends BaseService {
  @Inject(SkillDAO)
  private SkillDAO!: SkillDAO;

  async create(body: any) {
    const skill: any = await this.SkillDAO.createSkill(body);
    return skill;
  }

  async deleteSkillById(skill_id: string) {
    this.logger.info(
      `SkillsService: deleteSkillById: Deleting Skill for Skill ID:${skill_id}`,
    );

    const checkSkill = await this.SkillDAO.findSkill(skill_id);
    if (!checkSkill) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }
    const deleteSkill = await this.SkillDAO.deleteSkill(skill_id);

    return deleteSkill;
  }

  async getAllSkills(
    filters: Record<string, string[]>,
    page: string,
    limit: string,
  ) {
    this.logger.info("SkillsService: getAllSkills: Fetching All Skills ");

    const skills: any = await this.SkillDAO.getAllSkills(filters, page, limit);

    if (!skills) {
      this.logger.error("SkillsService: getAllSkills: Skills not found ");
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Skills"),
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    return skills;
  }

  async getAllSkillsAdmin() {
    this.logger.info("SkillsService: getAllSkills: Fetching All Skills ");

    const skills: any = await this.SkillDAO.getAllSkillsAdmin();

    if (!skills) {
      this.logger.error("SkillsService: getAllSkills: Skills not found ");
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Skills"),
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    return skills;
  }
  async getSkillById(skill_id: string) {
    this.logger.info(
      `SkillsService: getSkillById: Fetching Skill for Skill ID:${skill_id}`,
    );

    const checkSkill: any = await this.SkillDAO.findSkill(skill_id);
    if (!checkSkill) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    const getSkill: any = await this.SkillDAO.findSkillById(skill_id);

    return getSkill;
  }

  async updateSkill(skill_id: string, body: any) {
    this.logger.info(
      `SkillsService: updateSkill: Updating Skill for Skill ID:${skill_id}`,
    );

    const checkSkill: any = await this.SkillDAO.findSkill(skill_id);
    if (!checkSkill) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    const updateSkill: any = await this.SkillDAO.updateSkill(skill_id, body);

    return updateSkill;
  }
}
