/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, DELETE, GET, Inject, POST, PUT } from "fastify-decorators";
import { AuthController } from "../common/auth.controller";
import { FreelancerService } from "../services";

import {
  ERROR_CODES,
  GetFilterQueryParams,
  RESPONSE_MESSAGE,
  STATUS_CODES,
} from "../common/constants";

import {
  ALL_DEHIX_TALENT_ENDPOINT,
  FREELANCER_ADD_CONSULTANT_BY_ID,
  FREELANCER_CONVERSATION,
  FREELANCER_CREATE_EDUCATION_BY_ID,
  FREELANCER_CREATE_EXPERIENCE_BY_ID,
  FREELANCER_DEHIX_TALENT_ADD_BY_ID,
  FREELANCER_DEHIX_TALENT_BY_ID,
  FREELANCER_DEHIX_TALENT_DELETE_BY_ID,
  FREELANCER_DEHIX_TALENT_UPDATE_BY_ID,
  FREELANCER_DELETE_CONSULTANT_BY_ID,
  FREELANCER_DELETE_EDUCATION_BY_ID,
  FREELANCER_DOMAIN_ADD_BY_ID,
  FREELANCER_DOMAIN_DELETE_BY_ID,
  FREELANCER_DOMAIN_ENDPOINT,
  FREELANCER_EDUCATION_BY_ID,
  FREELANCER_ENDPOINT,
  FREELANCER_EXPERINCE_DELETE_BY_ID,
  FREELANCER_GET_CONSULTANT_BY_ID,
  FREELANCER_USERNAME_DETAILS_ENDPOINT,
  FREELANCER_ID_ENDPOINT,
  FREELANCER_INTERVIEWS_ALIGNED_BY_ID,
  FREELANCER_KYC_DETAILS_BY_ID,
  FREELANCER_KYC_UPDATE_BY_ID,
  FREELANCER_ONBOARDING_STATUS_BY_ID,
  FREELANCER_ORACLE_STATUS_BY_ID,
  FREELANCER_OWN_PROJECT_ID_ENDPOINT,
  FREELANCER_PROJECT_DELETE_BY_ID,
  FREELANCER_PROJECT_ID_ENDPOINT,
  FREELANCER_SKILLS_ADD_BY_ID,
  FREELANCER_SKILLS_ENDPOINT,
  FREELANCER_SKILL_DELETE_BY_ID,
  FREELANCER_STATUS_BY_ID,
  FREELANCER_UPDATE_CONSULTANT_BY_ID,
  FREELANCER_UPDATE_EDUCATION_BY_ID,
  FREELANCER_UPDATE_EXPERIENCE_BY_ID,
  FREELANCER_UPDATE_PROJECT_BY_ID,
  GET_SKILL_DOMAIN_VERIFIERS_BY_ID,
  NOT_INTERESTED_PROJECT,
  FREELANCER_DEHIX_TALENT_BY_STATUS,
  FREELANCER_UPDATE_ENDPOINT,
} from "../constants/freelancer.constant";

import {
  deleteDehixTalentFreelancerSchema,
  deleteEducationSchema,
  deleteFreelancerDomainSchema,
  deleteFreelancerProjectSchema,
  deleteFreelancerSkillSchema,
  deleteProfessionalInfoSchema,
} from "../schema/v1/freelancer/freelancer.delete";

import {
  getAllDehixTalentSchema,
  getFreelancerDehixTalentSchema,
  getFreelancerDetails,
  getFreelancerDomainSchema,
  getFreelancerEducationSchema,
  getFreelancerKycSchema,
  getFreelancerOwnProjectSchema,
  getFreelancerProjectSchema,
  getFreelancerSchema,
  getFreelancerSkillsSchema,
  getSkillDomainVerifiersSchema,
} from "../schema/v1/freelancer/freelancer.get";

import {
  addFreelancerDomainSchema,
  experinceInProfessionalInfo,
  interviewsAlignedSchema,
  oracleStatusSchema,
  updateDehixTalentSchema,
  updateEducationSchema,
  updateFreelancerKycSchema,
  updateFreelancerSchema,
  updateFreelancerStatusSchema,
  updateNotInterestedProjectSchema,
  updateOnboardingStatusSchema,
  updateProjectSchema,
} from "../schema/v1/freelancer/freelancer.update";

import {
  CreateDehixTalentBody,
  CreateFreelancerEducationBody,
  CreateFreelancerExperienceBody,
  CreateFreelancerProjectBody,
  GetFreelancerDetailsByUsernamePathParams,
  GetFreelancerPathParams,
  PostConsultantBody,
} from "../types/v1";

import {
  DeleteFreelancerDehixTalentPathParams,
  DeleteFreelancerDomainPathParams,
  DeleteFreelancerEducationPathParams,
  DeleteFreelancerExperiencePathParams,
  DeleteFreelancerProjectPathParams,
  DeleteFreelancerSkillPathParams,
} from "../types/v1/freelancer/deleteFreelancer";

import { PutStatusFreelancerBody } from "../types/v1/freelancer/UpdateFreelancer";

import {
  PutEducationPathParams,
  PutExperincePathParams,
  PutFreelancerBody,
  PutFreelancerDomainBody,
  PutFreelancerEducationBody,
  PutFreelancerExperinceBody,
  PutFreelancerInterviewsAlignedBody,
  PutFreelancerOnboardingStatusBody,
  PutFreelancerOracleStatusBody,
  PutFreelancerSkillsBody,
  PutProjectPathParams,
} from "../types/v1/freelancer/updateProfile";

import { PutFreelancerProjectBody } from "../types/v1/freelancer/updateProject";

import { createConsultantSchema } from "../schema/v1/consultant/consultant.create";
import { getConsultantSchema } from "../schema/v1/consultant/consultant.get";
import { updateConsultantSchema } from "../schema/v1/consultant/consultant.update";

import {
  createDehixTalentSchema,
  createEducationSchema,
  createFreelancerChatSchema,
  createProfessionalInfoSchema,
  createProjectSchema,
} from "../schema/v1/freelancer/freelancer.create";
import { addFreelancerSkillsSchema } from "../schema/v1/freelancer/freelancer.update";
import { GetconsultantPathParams } from "../types/v1/freelancer/getconsultant";
import { GetFreelancerProjectQueryParams } from "../types/v1/freelancer/getProjectStatus";
import { deleteConsultantSchema } from "../schema/v1/consultant/consultant.delete";
import {
  GetFreelancerDehixTalentByStatusQueryParams,
  GetFreelancerDehixTalentQueryParams,
} from "../types/v1/freelancer/getDehixTalent";

import {
  GetSkillDomainVerifiersPathParams,
  GetSkillDomainVerifiersQueryParams,
} from "../types/v1/freelancer/getSkillVerifier";

import { PutConsultantBody } from "../types/v1/freelancer/updateConsultant";
import {
  DehixTalentPathParams,
  PutDehixTalentBody,
} from "../types/v1/freelancer/updateDehixTalent";
import { UpdateNotinterestedPathParams } from "../types/v1/freelancer/updateNotInterestedProject";

import { GetKycQueryParams } from "../types/v1/freelancer/getKyc";
import { PutKycBody } from "../types/v1/freelancer/updateKyc";

import { extractFilters } from "../common/utils";
import { addConversation } from "../dao/conversations.dao";

// Controller for Freelancer
@Controller({ route: FREELANCER_ENDPOINT })
export default class FreelancerController extends AuthController {
  @Inject(FreelancerService)
  freelancerService!: FreelancerService;

  @GET(FREELANCER_ID_ENDPOINT, { schema: getFreelancerSchema })
  async getFreelancer(
    request: FastifyRequest<{ Params: GetFreelancerPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> getFreelancer -> Fetching freelancer profile for ID: ${request.userId}`,
      );

      const data = await this.freelancerService.getFreelancerProfileById(
        request.userId,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getFreelancer: ${error.message}`);
      if (
        error.ERROR_CODES === "FREELANCER_NOT_FOUND" ||
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @GET(FREELANCER_USERNAME_DETAILS_ENDPOINT, { schema: getFreelancerDetails })
  async getFreelancerDetails(
    request: FastifyRequest<{
      Params: GetFreelancerDetailsByUsernamePathParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> getFreelancerDetails -> Fetching freelancer details for userName: ${request.params.freelancer_username}`,
      );

      const data = await this.freelancerService.getFreelancerProfileByUserName(
        request.params.freelancer_username,
      );

      const professionalInfoArray = Array.from(data.professionalInfo).reduce<
        any[]
      >((result, [_, value]: any) => {
        if (value) {
          result.push(value);
        }
        return result;
      }, []);

      const educationArray = Array.from(data.education).reduce<any[]>(
        (result, [_, value]: any) => {
          if (value) {
            result.push(value);
          }
          return result;
        },
        [],
      );
      (data._doc as any).professionalInfo = professionalInfoArray;
      (data._doc as any).education = educationArray;

      reply.status(STATUS_CODES.SUCCESS).send(data);
    } catch (error: any) {
      this.logger.error(`Error in getFreelancer: ${error.message}`);
      if (
        error.ERROR_CODES === "FREELANCER_NOT_FOUND" ||
        error.message.includes(
          "Freelancer with provided userName could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @GET(FREELANCER_PROJECT_ID_ENDPOINT, { schema: getFreelancerProjectSchema })
  async getFreelancerProjects(
    request: FastifyRequest<{
      Params: GetFreelancerPathParams;
      Querystring: GetFreelancerProjectQueryParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> getFreelancerProjects -> Fetching freelancer projects for ID: ${request.params.freelancer_id}`,
      );

      const { freelancer_id } = request.params;
      const { status } = request.query;

      const data = await this.freelancerService.getFreelancerProjects(
        freelancer_id,
        status,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getFreelancer: ${error.message}`);
      if (
        error.ERROR_CODES === "FREELANCER_NOT_FOUND" ||
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @PUT(FREELANCER_UPDATE_ENDPOINT, { schema: updateFreelancerSchema })
  async updateFreelancer(
    request: FastifyRequest<{
      Body: PutFreelancerBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> updateFreelancer -> Updating profile for ID: ${request.userId}`,
      );
      const data = await this.freelancerService.updateProfileFreelancer(
        request.userId,
        request.body,
      );

      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ message: "profile updated" });
    } catch (error: any) {
      this.logger.error(`Error in updateFreelancer: ${error.message}`);
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  @DELETE(FREELANCER_SKILL_DELETE_BY_ID, {
    schema: deleteFreelancerSkillSchema,
  })
  async deleteSkillById(
    request: FastifyRequest<{ Params: DeleteFreelancerSkillPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> deleteSkillById -> Deleting skill using: ${request.userId}`,
      );
      const data = await this.freelancerService.deleteFreelancerSkill(
        request.userId,
        request.params.skill_id,
      );

      if (data.modifiedCount == 0) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Skill"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in deleteSkillById: ${error.message}`);
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  @PUT(FREELANCER_SKILLS_ADD_BY_ID, { schema: addFreelancerSkillsSchema })
  async addSkillsById(
    request: FastifyRequest<{
      Body: PutFreelancerSkillsBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> addSkillsById -> Adding skills for freelancer using ID: ${request.userId}`,
      );

      const { addSkills, freelancer_id } =
        await this.freelancerService.addFreelancerSkills(
          request.userId,
          request.body.skills,
        );

      reply.status(STATUS_CODES.SUCCESS).send({
        data: {
          freelancer_id,
          skills: addSkills,
        },
      });
    } catch (error: any) {
      this.logger.error(`Error in addSkillsById: ${error.message}`);

      if (error.message.includes(RESPONSE_MESSAGE.FREELANCER_NOT_FOUND)) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
          code: ERROR_CODES.FREELANCER_NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @PUT(FREELANCER_ORACLE_STATUS_BY_ID, { schema: oracleStatusSchema })
  async updateOracleStatusById(
    request: FastifyRequest<{
      Body: PutFreelancerOracleStatusBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> updateOracleStatusById -> Updating oracle status of freelancer using ID: ${request.userId}`,
      );

      const data = await this.freelancerService.updateFreelancerOracleStatus(
        request.userId,
        request.body.oracleStatus,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in updateOracleStatusById: ${error.message}`);
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  @PUT(FREELANCER_INTERVIEWS_ALIGNED_BY_ID, { schema: interviewsAlignedSchema })
  async interviewsAlignedById(
    request: FastifyRequest<{
      Body: PutFreelancerInterviewsAlignedBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> interviewsAlignedById -> Interviews aligned of freelancer using ID: ${request.userId}`,
      );

      const data = await this.freelancerService.freelancerInterviewsAligned(
        request.userId,
        request.body.interviewsAligned,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in aligned interviews: ${error.message}`);
      if (
        error.ERROR_CODES === "FREELANCER_NOT_FOUND" ||
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @PUT(FREELANCER_UPDATE_EXPERIENCE_BY_ID, {
    schema: experinceInProfessionalInfo,
  })
  async putExperienceFreelancer(
    request: FastifyRequest<{
      Params: PutExperincePathParams;
      Body: PutFreelancerExperinceBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> putExperienceFreelancer-> update experince freelancer  using ID: ${request.userId}`,
      );

      const data = await this.freelancerService.putFreelancerExperience(
        request.userId,
        request.params.experience_id,
        request.body,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in experince add: ${error.message}`);
      if (
        error.ERROR_CODES === "FREELANCER_NOT_FOUND" ||
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.ERROR_CODES === "EXPERIENCE_NOT_FOUND" ||
        error.message.includes("Freelancer experience  not found by id")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Experience"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @DELETE(FREELANCER_EXPERINCE_DELETE_BY_ID, {
    schema: deleteProfessionalInfoSchema,
  })
  async deleteExperienceFreelancer(
    request: FastifyRequest<{ Params: DeleteFreelancerExperiencePathParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> deleteExperienceFreelancer -> Deleting experience using ID: ${request.userId}`,
      );

      await this.freelancerService.deleteFreelancerExperience(
        request.userId,
        request.params.experience_id,
      );

      reply
        .status(STATUS_CODES.SUCCESS)
        .send({ message: "Experience deleted" });
    } catch (error: any) {
      this.logger.error(
        `Error in deleteExperienceFreelancer: ${error.message}`,
      );
      if (
        error.ERROR_CODES === "FREELANCER_NOT_FOUND" ||
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.ERROR_CODES === "EXPERIENCE_NOT_FOUND" ||
        error.message.includes("Freelancer experience not found by id")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Experience"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @POST(FREELANCER_CREATE_EXPERIENCE_BY_ID, {
    schema: createProfessionalInfoSchema,
  })
  async createExperience(
    request: FastifyRequest<{
      Body: CreateFreelancerExperienceBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> deleteExperienceFreelancer -> Deleting experience using ID: ${request.userId}`,
      );

      const data = await this.freelancerService.createFreelancerExperience(
        request.userId,
        request.body,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(
        `Error in CreateExperienceFreelancer: ${error.message}`,
      );
      if (
        error.ERROR_CODES === "FREELANCER_NOT_FOUND" ||
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @POST(FREELANCER_CREATE_EDUCATION_BY_ID, { schema: createEducationSchema })
  async createEducation(
    request: FastifyRequest<{
      Body: CreateFreelancerEducationBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> createEducation -> Create education using ID: ${request.userId}`,
      );

      const data = await this.freelancerService.createFreelancerEducation(
        request.userId,
        request.body,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in CreateEducation: ${error.message}`);
      if (
        error.ERROR_CODES === "FREELANCER_NOT_FOUND" ||
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @PUT(FREELANCER_UPDATE_EDUCATION_BY_ID, { schema: updateEducationSchema })
  async updateEducationFreelancer(
    request: FastifyRequest<{
      Params: PutEducationPathParams;
      Body: PutFreelancerEducationBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> updateEducationFreelancer-> update education freelancer using ID: ${request.userId}`,
      );

      const data = await this.freelancerService.putFreelancerEducation(
        request.userId,
        request.params.education_id,
        request.body,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in education add: ${error.message}`);
      if (
        error.ERROR_CODES === "FREELANCER_NOT_FOUND" ||
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.ERROR_CODES === "EDUCATION_NOT_FOUND" ||
        error.message.includes("Freelancer education not found by id")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Education"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @DELETE(FREELANCER_DELETE_EDUCATION_BY_ID, { schema: deleteEducationSchema })
  async deleteEducationFreelancer(
    request: FastifyRequest<{ Params: DeleteFreelancerEducationPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> deleteEducationFreelancer -> Deleting education using ID: ${request.userId}`,
      );

      await this.freelancerService.deleteFreelancerEducation(
        request.userId,
        request.params.education_id,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ message: "Education deleted" });
    } catch (error: any) {
      this.logger.error(`Error in deleteEducationFreelancer: ${error.message}`);
      if (
        error.ERROR_CODES === "FREELANCER_NOT_FOUND" ||
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.ERROR_CODES === "EDUCATION_NOT_FOUND" ||
        error.message.includes("Freelancer education not found by id")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Education"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @POST(FREELANCER_PROJECT_ID_ENDPOINT, { schema: createProjectSchema })
  async createProject(
    request: FastifyRequest<{
      Body: CreateFreelancerProjectBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> createProject -> Create project using ID: ${request.userId}`,
      );

      const data = await this.freelancerService.createFreelancerProject(
        request.userId,
        request.body,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in CreateProject: ${error.message}`);
      if (
        error.ERROR_CODES === "FREELANCER_NOT_FOUND" ||
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @PUT(FREELANCER_UPDATE_PROJECT_BY_ID, { schema: updateProjectSchema })
  async updateProjectFreelancer(
    request: FastifyRequest<{
      Params: PutProjectPathParams;
      Body: PutFreelancerProjectBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> updateProjectFreelancer-> update project freelancer using ID: ${request.userId}`,
      );

      const data = await this.freelancerService.putFreelancerProject(
        request.userId,
        request.params.project_id,
        request.body,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in project update: ${error.message}`);
      if (
        error.ERROR_CODES === "FREELANCER_NOT_FOUND" ||
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.ERROR_CODES === "PROJECT_NOT_FOUND" ||
        error.message.includes("Project by provided ID was not found.")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Project"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @DELETE(FREELANCER_PROJECT_DELETE_BY_ID, {
    schema: deleteFreelancerProjectSchema,
  })
  async deleteProjectById(
    request: FastifyRequest<{ Params: DeleteFreelancerProjectPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> deleteProjectById -> Deleting project using ID: ${request.userId}`,
      );

      await this.freelancerService.deleteFreelancerProject(
        request.userId,
        request.params.project_id,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ message: "Project deleted" });
    } catch (error: any) {
      this.logger.error(`Error in deleteProjectFreelancer: ${error.message}`);
      if (
        error.ERROR_CODES === "FREELANCER_NOT_FOUND" ||
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.ERROR_CODES === "FREELANCER_PROJECT_NOT_FOUND" ||
        error.message.includes("Project by provided ID was not found.")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Project"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @GET("", { schema: getFreelancerSchema })
  async getAllFreelancer(
    request: FastifyRequest<{ Querystring: GetFilterQueryParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(`FreelancerController -> getAllFreelancer`);

      const filters = extractFilters(request.url);
      const { page, limit } = request.query;

      const data = await this.freelancerService.getAllFreelancer(
        filters,
        page,
        limit,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getAllFreelancer: ${error.message}`);
      if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Data not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancers"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @GET(FREELANCER_KYC_DETAILS_BY_ID, { schema: getFreelancerKycSchema })
  async getFreelancerKycDetails(
    request: FastifyRequest<{ Params: GetKycQueryParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `Fetching KYC details for Freelancer ID: ${request.userId}`,
      );

      const freelancer = await this.freelancerService.getFreelancerProfileById(
        request.userId,
      );

      if (!freelancer || !freelancer.kyc) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("KYC details"),
          code: ERROR_CODES.NOT_FOUND,
        });
        return;
      }

      reply.status(STATUS_CODES.SUCCESS).send(freelancer.kyc);
    } catch (error: any) {
      this.logger.error(`Error fetching KYC details: ${error.message}`);
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }
  @PUT(FREELANCER_KYC_UPDATE_BY_ID, { schema: updateFreelancerKycSchema })
  async updateFreelancerKYCDetails(
    request: FastifyRequest<{
      Body: PutKycBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `Updating KYC details for Freelancer ID: ${request.userId}`,
      );
      const updatedKyc = await this.freelancerService.updateKYCDetails(
        request.userId,
        request.body,
      );

      reply.status(STATUS_CODES.SUCCESS).send(updatedKyc);
    } catch (error: any) {
      this.logger.error(`Error updating KYC details: ${error.message}`);
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  @PUT(FREELANCER_DOMAIN_ADD_BY_ID, { schema: addFreelancerDomainSchema })
  async addDomainById(
    request: FastifyRequest<{
      Body: PutFreelancerDomainBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> addDomainById -> Adding domain for freelancer using ID: ${request.userId}`,
      );

      const { addDomains, freelancer_id } =
        await this.freelancerService.addFreelancerDomain(
          request.userId,
          request.body.domain,
        );

      reply.status(STATUS_CODES.SUCCESS).send({
        data: {
          freelancer_id,
          domain: addDomains,
        },
      });
    } catch (error: any) {
      this.logger.error(`Error in addDomainById: ${error.message}`);

      if (error.message.includes(RESPONSE_MESSAGE.FREELANCER_NOT_FOUND)) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
          code: ERROR_CODES.FREELANCER_NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @DELETE(FREELANCER_DOMAIN_DELETE_BY_ID, {
    schema: deleteFreelancerDomainSchema,
  })
  async deleteDomainById(
    request: FastifyRequest<{ Params: DeleteFreelancerDomainPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> deleteDomainById -> Deleting domain using: ${request.userId}`,
      );
      const data = await this.freelancerService.deleteFreelancerDomain(
        request.userId,
        request.params.domain_id,
      );

      if (data.modifiedCount == 0) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Domain"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in deleteDomainById: ${error.message}`);
      reply.status(STATUS_CODES.SERVER_ERROR).send({
        message: RESPONSE_MESSAGE.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  @GET(FREELANCER_OWN_PROJECT_ID_ENDPOINT, {
    schema: getFreelancerOwnProjectSchema,
  })
  async getFreelancerOwnProjects(
    request: FastifyRequest<{
      Params: GetFreelancerPathParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> getFreelancerOwnProjects -> Fetching freelancer own projects for ID: ${request.userId}`,
      );

      const data = await this.freelancerService.getFreelancerOwnProjects(
        request.userId,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getFreelancerOwnProjects: ${error.message}`);
      if (
        error.ERROR_CODES === "FREELANCER_NOT_FOUND" ||
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @GET(FREELANCER_SKILLS_ENDPOINT, { schema: getFreelancerSkillsSchema })
  async getFreelancerSkills(
    request: FastifyRequest<{
      Params: GetFreelancerPathParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> getFreelancerSkills -> Fetching freelancer skills for ID: ${request.userId}`,
      );

      const data = await this.freelancerService.getFreelancerSkills(
        request.userId,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getFreelancerSkills: ${error.message}`);
      if (
        error.ERROR_CODES === "FREELANCER_NOT_FOUND" ||
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @GET(FREELANCER_DOMAIN_ENDPOINT, { schema: getFreelancerDomainSchema })
  async getFreelancerDomains(
    request: FastifyRequest<{
      Params: GetFreelancerPathParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> getFreelancerDomain -> Fetching freelancer domains for ID: ${request.userId}`,
      );

      const data = await this.freelancerService.getFreelancerDomains(
        request.userId,
      );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getFreelancerDomains: ${error.message}`);
      if (
        error.ERROR_CODES === "FREELANCER_NOT_FOUND" ||
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @POST(FREELANCER_DEHIX_TALENT_ADD_BY_ID, {
    schema: createDehixTalentSchema,
  })
  async createDehixTalent(
    request: FastifyRequest<{
      Body: CreateDehixTalentBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> createDehixTalent -> Create Dehix Talent using ID: ${request.userId}`,
      );

      // Call the service to create Dehix talent
      const createdTalent =
        await this.freelancerService.createFreelancerDehixTalent(
          request.userId,
          request.body,
        );

      // Send the created Dehix talent in the response
      reply.status(STATUS_CODES.SUCCESS).send({ data: createdTalent });
    } catch (error: any) {
      this.logger.error(
        `Error in createFreelancerDehixTalent: ${error.message}`,
      );
      if (
        error.ERROR_CODES === "FREELANCER_NOT_FOUND" ||
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @DELETE(FREELANCER_DEHIX_TALENT_DELETE_BY_ID, {
    schema: deleteDehixTalentFreelancerSchema,
  })
  async deleteDehixTalentFreelancer(
    request: FastifyRequest<{ Params: DeleteFreelancerDehixTalentPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> deleteDehixTalentFreelancer -> Deleting dehixTalent using ID: ${request.userId}`,
      );

      await this.freelancerService.deleteFreelancerDehixTalent(
        request.userId,
        request.params.dehixtalent_id,
      );

      reply
        .status(STATUS_CODES.SUCCESS)
        .send({ message: "dehixTalent deleted" });
    } catch (error: any) {
      this.logger.error(
        `Error in deleteDehixTalentFreelancer: ${error.message}`,
      );
      if (
        error.ERROR_CODES === "FREELANCER_NOT_FOUND" ||
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.ERROR_CODES === "DEHIX_TALENT_NOT_FOUND" ||
        error.message.includes("Dehix Talent not found by id")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Dehix Talent"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @POST(FREELANCER_ADD_CONSULTANT_BY_ID, { schema: createConsultantSchema })
  async createConsultant(
    request: FastifyRequest<{
      Params: GetconsultantPathParams;
      Body: PostConsultantBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> createConsultant -> Creating consultant using ID: ${request.userId}`,
      );

      const data = await this.freelancerService.createConsultant(
        request.userId,
        request.body,
      );
      reply.status(STATUS_CODES.CREATED).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in createConsultant: ${error.message}`);
      if (
        error.ERROR_CODES === "FREELANCER_NOT_FOUND" ||
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @PUT(FREELANCER_UPDATE_CONSULTANT_BY_ID, { schema: updateConsultantSchema })
  async updateConsultantById(
    request: FastifyRequest<{
      Params: GetconsultantPathParams;
      Body: PutConsultantBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> updateConsultantById -> Updating consultant with ID: ${request.params.consultant_id}`,
      );

      await this.freelancerService.updateConsultant(
        request.userId,
        request.params.consultant_id!,
        request.body,
      );
      reply
        .status(STATUS_CODES.SUCCESS)
        .send({ message: "Consultant updated" });
    } catch (error: any) {
      this.logger.error(`Error in updateConsultantById: ${error.message}`);
      if (
        error.ERROR_CODES === "FREELANCER_NOT_FOUND" ||
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.ERROR_CODES === "CONSULTANT_NOT_FOUND" ||
        error.message.includes("Consultant with provided ID could not be found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Consultant"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @GET(FREELANCER_GET_CONSULTANT_BY_ID, { schema: getConsultantSchema })
  async getConsultantById(
    request: FastifyRequest<{ Params: GetconsultantPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> getConsultantById -> Retrieving consultant with ID: ${request.params.consultant_id}`,
      );

      const data = await this.freelancerService.getConsultantById(
        request.userId,
        request.params.consultant_id!,
      );
      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getConsultantById: ${error.message}`);
      if (
        error.ERROR_CODES === "FREELANCER_NOT_FOUND" ||
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.ERROR_CODES === "CONSULTANT_NOT_FOUND" ||
        error.message.includes("Consultant with provided ID could not be found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Consultant"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @DELETE(FREELANCER_DELETE_CONSULTANT_BY_ID, {
    schema: deleteConsultantSchema,
  })
  async deleteConsultantById(
    request: FastifyRequest<{ Params: GetconsultantPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> deleteConsultantById -> Deleting consultant with ID: ${request.params.consultant_id}`,
      );

      await this.freelancerService.deleteConsultant(
        request.userId,
        request.params.consultant_id!,
      );
      reply
        .status(STATUS_CODES.SUCCESS)
        .send({ message: "Consultant deleted" });
    } catch (error: any) {
      this.logger.error(`Error in deleteConsultantById: ${error.message}`);
      if (
        error.ERROR_CODES === "FREELANCER_NOT_FOUND" ||
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.ERROR_CODES === "CONSULTANT_NOT_FOUND" ||
        error.message.includes("Consultant with provided ID could not be found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Consultant"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @PUT(NOT_INTERESTED_PROJECT, { schema: updateNotInterestedProjectSchema })
  async updateNotInterestedProject(
    request: FastifyRequest<{ Params: UpdateNotinterestedPathParams }>,
    reply: FastifyReply,
  ) {
    try {
      await this.freelancerService.notInterestedProject(
        request.userId,
        request.params.project_id,
      );
      reply.status(STATUS_CODES.SUCCESS).send({ message: "update sucessfull" });
    } catch (error: any) {
      this.logger.error(
        `Error in updateNotInterestedProject: ${error.message}`,
      );
      if (
        error.ERROR_CODES === "FREELANCER_NOT_FOUND" ||
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Project not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Project"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @GET(ALL_DEHIX_TALENT_ENDPOINT, { schema: getAllDehixTalentSchema })
  async getAllDehixTalent(
    request: FastifyRequest<{
      Querystring: GetFreelancerDehixTalentQueryParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancersController -> getAllDehixTalent -> Fetching dehix talent`,
      );

      const { limit, skip } = request.query;
      const data = await this.freelancerService.getAllDehixTalent(limit, skip);

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getAllDehixTalent: ${error.message}`);
      if (
        error.ERROR_CODES === "DEHIX_TALENT_NOT_FOUND" ||
        error.message.includes("Dehix Talent not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Dehix Talent"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @GET(FREELANCER_DEHIX_TALENT_BY_ID, {
    schema: getFreelancerDehixTalentSchema,
  })
  async getFreelancerDehixTalent(
    request: FastifyRequest<{
      Params: GetFreelancerPathParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> getFreelancerDehixTalent -> Fetching freelancer dehix talent for ID: ${request.userId}`,
      );

      const data = await this.freelancerService.getFreelancerDehixTalent(
        request.userId,
      );

      if (!data || data.length === 0) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Dehix Talent"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }
      this.logger.info("Fetched data: ", data);
      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getFreelancerDehixTalent: ${error.message}`);
      if (
        error.ERROR_CODES === "FREELANCER_NOT_FOUND" ||
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @GET(FREELANCER_DEHIX_TALENT_BY_STATUS, {
    schema: getFreelancerDehixTalentSchema,
  })
  async getFreelancerDehixTalentByStatus(
    request: FastifyRequest<{
      Params: GetFreelancerPathParams;
      Querystring: GetFreelancerDehixTalentByStatusQueryParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> getFreelancerDehixTalent -> Fetching freelancer dehix talent by status`,
      );

      const data =
        await this.freelancerService.getFreelancerDehixTalentByStatus(
          request.params.freelancer_id,
          request.query.status,
        );

      if (!data || data.length === 0) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Dehix Talent"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }
      this.logger.info("Fetched data: ", data);
      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getFreelancerDehixTalent: ${error.message}`);
      if (
        error.ERROR_CODES === "FREELANCER_NOT_FOUND" ||
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @PUT(FREELANCER_DEHIX_TALENT_UPDATE_BY_ID, {
    schema: updateDehixTalentSchema,
  })
  async updateDehixTalentById(
    request: FastifyRequest<{
      Params: DehixTalentPathParams;
      Body: PutDehixTalentBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> updateDehixTalentById -> Updating dehixTalent with ID: ${request.params.dehixtalent_id}`,
      );

      const data = await this.freelancerService.updateDehixTalent(
        request.userId,
        request.params.dehixtalent_id!,
        request.body,
      );
      reply
        .status(STATUS_CODES.SUCCESS)
        .send({ message: "Dehix Talent updated", data });
    } catch (error: any) {
      this.logger.error(`Error in updateDehixTalentById: ${error.message}`);
      if (
        error.ERROR_CODES === "FREELANCER_NOT_FOUND" ||
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.ERROR_CODES === "DEHIX_TALENT_NOT_FOUND" ||
        error.message.includes("Dehix Talent not found by id")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Dehix Talent"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @GET(FREELANCER_EDUCATION_BY_ID, {
    schema: getFreelancerEducationSchema,
  })
  async getFreelancerEducation(
    request: FastifyRequest<{
      Params: GetFreelancerPathParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> getFreelancerEducation -> Fetching freelancer education for ID: ${request.userId}`,
      );

      const data = await this.freelancerService.getFreelancerEducation(
        request.userId,
      );

      if (!data || data.length === 0) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Dehix Talent"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getFreelancerEducation: ${error.message}`);
      if (
        error.ERROR_CODES === "FREELANCER_NOT_FOUND" ||
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @PUT(FREELANCER_ONBOARDING_STATUS_BY_ID, {
    schema: updateOnboardingStatusSchema,
  })
  async updateOnboardingStatusById(
    request: FastifyRequest<{
      Body: PutFreelancerOnboardingStatusBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> updateOnboardingStatusById -> Updating onboarding status of freelancer using ID: ${request.userId}`,
      );

      const data =
        await this.freelancerService.updateFreelancerOnboardingStatus(
          request.userId,
          request.body.onboardingStatus,
        );

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(
        `Error in updateOnboardingStatusById: ${error.message}`,
      );
      if (
        error.ERROR_CODES === "FREELANCER_NOT_FOUND" ||
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @PUT(FREELANCER_STATUS_BY_ID, {
    schema: updateFreelancerStatusSchema,
  })
  async updateStatusByFreelancerId(
    request: FastifyRequest<{
      Body: PutStatusFreelancerBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(`Updating status with Freelancer_ID ${request.userId}`);

      const data =
        await this.freelancerService.updateFreelancerStatusByFreelancerID(
          request.userId,
          request.body.status,
        );

      if (!data) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ message: "update sucessful" });
    } catch (error: any) {
      this.logger.error(`Error updating Status: ${error.message}`);

      if (
        error.code === ERROR_CODES.NOT_FOUND ||
        error.message.includes("Data not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.DATA_NOT_FOUND,
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.ERROR_CODES === "Freelancer_NOT_FOUND" ||
        error.message.includes("Freelancer by provided ID was not found.")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.ERROR_CODES === "NOT_FOUND" ||
        error.message.includes("Freelancer by provided ID was not found.")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @GET(GET_SKILL_DOMAIN_VERIFIERS_BY_ID, {
    schema: getSkillDomainVerifiersSchema,
  })
  async getSkillDomainVerifiers(
    request: FastifyRequest<{
      Params: GetSkillDomainVerifiersPathParams;
      Querystring: GetSkillDomainVerifiersQueryParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.logger.info(
        `FreelancerController -> getSkillDomainVerifiers -> Fetching skill or domain verifier by skill or domain Id: ${request.params.doc_id}`,
      );

      const data = await this.freelancerService.getSkillDomainVerifiers(
        request.userId,
        request.params.doc_id,
        request.query.doc_type,
      );

      if (!data || data.length === 0) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Verifier"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      reply.status(STATUS_CODES.SUCCESS).send({ data });
    } catch (error: any) {
      this.logger.error(`Error in getSkillDomainVerifiers: ${error.message}`);
      if (
        error.ERROR_CODES === "FREELANCER_NOT_FOUND" ||
        error.message.includes(
          "Freelancer with provided ID could not be found.",
        )
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }

  @POST(FREELANCER_CONVERSATION, { schema: createFreelancerChatSchema })
  async createConversation(
    request: FastifyRequest<{
      Body: { participants: string[]; project_name: string };
    }>,
    reply: FastifyReply,
  ) {
    const freelancer_id = request.userId;
    const { participants, project_name } = request.body;

    // Basic validation
    if (!participants || participants.length === 0 || !project_name) {
      return reply.status(400).send({
        message: "Participants and project name are required.",
        code: ERROR_CODES.NOT_FOUND,
      });
    }

    try {
      this.logger.info(
        `Creating conversation for Freelancer_ID: ${freelancer_id}`,
      );

      // Validate if the freelancer exists
      const freelancer =
        await this.freelancerService.getFreelancerProfileById(freelancer_id);
      if (!freelancer) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      // Add the conversation for the freelancer
      const conversationId = await addConversation({
        participants,
        project_name,
      });

      reply.status(STATUS_CODES.SUCCESS).send({
        message: "Conversation created successfully.",
        conversationId,
      });
    } catch (error: any) {
      this.logger.error(`Error creating conversation: ${error.message}`);

      if (
        error.code === ERROR_CODES.NOT_FOUND ||
        error.message.includes("Data not found")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.DATA_NOT_FOUND,
          code: ERROR_CODES.NOT_FOUND,
        });
      } else if (
        error.ERROR_CODES === "Freelancer_NOT_FOUND" ||
        error.message.includes("Freelancer by provided ID was not found.")
      ) {
        reply.status(STATUS_CODES.NOT_FOUND).send({
          message: RESPONSE_MESSAGE.NOT_FOUND("Freelancer"),
          code: ERROR_CODES.NOT_FOUND,
        });
      } else {
        reply.status(STATUS_CODES.SERVER_ERROR).send({
          message: RESPONSE_MESSAGE.SERVER_ERROR,
          code: ERROR_CODES.SERVER_ERROR,
        });
      }
    }
  }
}
