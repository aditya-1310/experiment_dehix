import { Service, Inject } from "fastify-decorators";

import { BaseService } from "../common/base.service";
import { NotFoundError } from "../common/errors";
import { ERROR_CODES, RESPONSE_MESSAGE } from "../common/constants";
import { HireDAO } from "../dao/hireDehixTalent.dao";
import { IHire } from "../models/hireDehixTalent.entity";
import { businessDAO, FreelancerDAO } from "../dao";
import {
  AddDehixTalentInInvitedBody,
  PutHireDehixTalentBody,
  PutHireDehixTalentBookmarkedBody,
  PutStatusHireDehixTalent,
} from "../types/v1";
import { AddDehixTalentInLobbyBody } from "../types/v1/hireDehixTalent/addFreelancerIntoLobby";

@Service()
export class HireService extends BaseService {
  @Inject(HireDAO)
  private HireDAO!: HireDAO;
  @Inject(businessDAO)
  private businessDAO!: businessDAO;
  @Inject(FreelancerDAO)
  private FreelancerDAO!: FreelancerDAO;

  async createhireDehixTalent(business_id: string, data: IHire) {
    try {
      this.logger.info(
        "HireService: createHireDehixTalent: Creating HireDehixTalent: ",
        business_id,
      );

      const hireTalent: any = await this.HireDAO.createHireDehixTalent({
        ...data,
        businessId: business_id,
      });

      const user: any = await this.businessDAO.findBusinessById(business_id);

      const projectCost = Number(process.env.HIRE_TALENT_CREATION_COST) || 0;

      if (user.connects < projectCost) {
        throw new Error("Insufficient connects to create a project.");
      }

      user.connects -= projectCost;
      await user.save();

      return hireTalent;
    } catch (error: any) {
      this.logger.error("Error in createHireDehixTalent:", error);
      throw error; // Pass the error to the parent for proper handling
    }
  }

  async putHireDehixTalent(
    hireDehixTalent_id: string,
    update: PutHireDehixTalentBody,
  ) {
    this.logger.info(
      "HireService: update hire dehix talent ",
      hireDehixTalent_id,
    );

    const data = await this.HireDAO.updateHireDehixTalent(
      hireDehixTalent_id,
      update,
    );
    this.logger.info(data, "in update hireDehixTalent");
    return data;
  }

  async deleteHireDehixTalent(hireDehixTalent_id: string) {
    this.logger.info("HireService: deleteHireDehixTalent", hireDehixTalent_id);

    const hireDehixTalentExist =
      await this.HireDAO.findHireDehixTalentById(hireDehixTalent_id);
    if (!hireDehixTalentExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.HIRE_DEHIX_TALENT_NOT_FOUND,
        ERROR_CODES.HIRE_DEHIX_TALENT_NOT_FOUND,
      );
    }

    const data =
      await this.HireDAO.deleteHireDehixTalentById(hireDehixTalent_id);
    return data;
  }

  async getHireDehixTalentById(business_id: string) {
    this.logger.info(
      "HireService: getHireDehixTalent: get hire dehix talent: ",
      business_id,
    );

    const userExist = await this.businessDAO.findBusinessById(business_id);
    if (!userExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.BUSINESS_NOT_FOUND,
        ERROR_CODES.BUSINESS_NOT_FOUND,
      );
    }

    const data = await this.HireDAO.getHireDehixTalent(business_id);
    return data;
  }

  async updateHireDehixTalent(
    business_id: string,
    hireDehixTalent_id: string,
    update: PutStatusHireDehixTalent,
  ) {
    this.logger.info(
      "HireService: updateHireDehixTalent",
      business_id,
      hireDehixTalent_id,
    );
    const businessExist = await this.businessDAO.findBusinessById(business_id);
    if (!businessExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.BUSINESS_NOT_FOUND,
        ERROR_CODES.BUSINESS_NOT_FOUND,
      );
    }
    const hireDehixTalent = await this.HireDAO.getHireDehixTalent(business_id);
    if (!hireDehixTalent) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.HIRE_DEHIX_TALENT_NOT_FOUND,
        ERROR_CODES.HIRE_DEHIX_TALENT_NOT_FOUND,
      );
    }
    const data = await this.HireDAO.updateStatusHireDehixTalent(
      business_id,
      hireDehixTalent_id,
      update,
    );
    return data;
  }

  async updateHireDehixTalentBookmarked(
    business_id: string,
    hireDehixTalent_id: string,
    update: PutHireDehixTalentBookmarkedBody,
  ) {
    this.logger.info(
      "HireService: updateHireDehixTalent",
      business_id,
      hireDehixTalent_id,
    );
    const businessExist = await this.businessDAO.findBusinessById(business_id);
    if (!businessExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.BUSINESS_NOT_FOUND,
        ERROR_CODES.BUSINESS_NOT_FOUND,
      );
    }
    const hireDehixTalent = await this.HireDAO.getHireDehixTalent(business_id);
    if (!hireDehixTalent) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.HIRE_DEHIX_TALENT_NOT_FOUND,
        ERROR_CODES.HIRE_DEHIX_TALENT_NOT_FOUND,
      );
    }
    const data = await this.HireDAO.updateStatusHireDehixTalentBookmarked(
      hireDehixTalent_id,
      update,
    );
    return data;
  }

  async addDehixTalentIntoLobby(data: AddDehixTalentInLobbyBody) {
    this.logger.info("HireService: addDehixTalentIntoLobby");

    const results: any = [];

    for (const hireDehixTalent_id of data.hireDehixTalent_id) {
      const hireDehixTalent =
        await this.HireDAO.findHireDehixTalentById(hireDehixTalent_id);

      if (!hireDehixTalent) {
        this.logger.warn(
          `HireDehixTalent not found for ID: ${hireDehixTalent_id}`,
        );
        continue;
      }

      const updatedHire = await this.HireDAO.addDehixTalentIntoLobby(
        hireDehixTalent_id,
        data,
      );

      results.push(updatedHire);
    }

    return results;
  }

  async inviteDehixTalent(
    hireDehixTalent_id: string,
    data: AddDehixTalentInInvitedBody,
  ) {
    this.logger.info("HireService: inviteDehixTalent", hireDehixTalent_id);

    const hireDehixTalent =
      await this.HireDAO.findHireDehixTalentById(hireDehixTalent_id);
    if (!hireDehixTalent) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.HIRE_DEHIX_TALENT_NOT_FOUND,
        ERROR_CODES.HIRE_DEHIX_TALENT_NOT_FOUND,
      );
    }

    let isFreelancerInLobby = false;
    for (const lobby of hireDehixTalent.freelancerInLobby) {
      if (lobby.freelancerId == data.freelancerId) {
        isFreelancerInLobby = true;
        break;
      }
    }
    if (!isFreelancerInLobby) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("freelencer id not present in lobby"),
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    const response = await this.HireDAO.inviteDehixTalent(
      hireDehixTalent_id,
      data,
    );

    return response;
  }

  async selectDehixTalent(
    hireDehixTalent_id: string,
    data: AddDehixTalentInLobbyBody,
  ) {
    this.logger.info("HireService: selectDehixTalent", hireDehixTalent_id);

    const hireDehixTalent =
      await this.HireDAO.findHireDehixTalentById(hireDehixTalent_id);
    if (!hireDehixTalent) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.HIRE_DEHIX_TALENT_NOT_FOUND,
        ERROR_CODES.HIRE_DEHIX_TALENT_NOT_FOUND,
      );
    }

    let isFreelancerInvited = false;
    for (const invited of hireDehixTalent.freelancerInvited) {
      if (invited.freelancerId == data.freelancerId) {
        isFreelancerInvited = true;
        break;
      }
    }
    if (!isFreelancerInvited) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("freelencer is not invited"),
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    const response = await this.HireDAO.selectDehixTalent(
      hireDehixTalent_id,
      data,
    );

    return response;
  }

  async rejectDehixTalent(
    hireDehixTalent_id: string,
    data: AddDehixTalentInLobbyBody,
  ) {
    this.logger.info("HireService: rejectDehixTalent", hireDehixTalent_id);

    const hireDehixTalent =
      await this.HireDAO.findHireDehixTalentById(hireDehixTalent_id);
    if (!hireDehixTalent) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.HIRE_DEHIX_TALENT_NOT_FOUND,
        ERROR_CODES.HIRE_DEHIX_TALENT_NOT_FOUND,
      );
    }

    let isFreelancerInLobby = false;
    for (const lobby of hireDehixTalent.freelancerInLobby) {
      if (lobby.freelancerId == data.freelancerId) {
        isFreelancerInLobby = true;
        break;
      }
    }
    let isFreelancerInvited = false;
    for (const invited of hireDehixTalent.freelancerInvited) {
      if (invited.freelancerId == data.freelancerId) {
        isFreelancerInvited = true;
        break;
      }
    }
    if (!isFreelancerInLobby) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("freelencer id not present in lobby"),
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }
    if (!isFreelancerInvited) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("freelencer is not invited"),
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    const response = await this.HireDAO.rejectDehixTalent(
      hireDehixTalent_id,
      data,
    );

    return response;
  }

  async getDehixTalentInLobby(hireDehixTalent_id: string) {
    this.logger.info("HireService: getDehixTalentInLobby", hireDehixTalent_id);

    const hireDehixTalent =
      await this.HireDAO.findHireDehixTalentById(hireDehixTalent_id);
    if (!hireDehixTalent) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.HIRE_DEHIX_TALENT_NOT_FOUND,
        ERROR_CODES.HIRE_DEHIX_TALENT_NOT_FOUND,
      );
    }

    const response =
      await this.HireDAO.getDehixTalentInLobby(hireDehixTalent_id);

    const freelancers: any[] = [];
    for (const lobby of response!.freelancerInLobby) {
      const freelancer = await this.FreelancerDAO.findFreelancerById(
        lobby.freelancerId,
      );
      if (!freelancer) {
        throw new NotFoundError(
          RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
          ERROR_CODES.NOT_FOUND,
        );
      }
      const updatedFreelancer = {
        ...(freelancer as any)._doc,
        DehixTalentIdInLobby: lobby.dehixTalentId,
      };
      freelancers.push(updatedFreelancer);
    }

    return freelancers;
  }

  async getInvitedDehixTalent(hireDehixTalent_id: string) {
    this.logger.info("HireService: getInvitedDehixTalent", hireDehixTalent_id);

    const hireDehixTalent =
      await this.HireDAO.findHireDehixTalentById(hireDehixTalent_id);
    if (!hireDehixTalent) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.HIRE_DEHIX_TALENT_NOT_FOUND,
        ERROR_CODES.HIRE_DEHIX_TALENT_NOT_FOUND,
      );
    }

    const response =
      await this.HireDAO.getInvitedDehixTalent(hireDehixTalent_id);

    const freelancers: any[] = [];
    for (const invited of response!.freelancerInvited) {
      const freelancer = await this.FreelancerDAO.findFreelancerById(
        invited.freelancerId,
      );
      if (!freelancer) {
        throw new NotFoundError(
          RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
          ERROR_CODES.NOT_FOUND,
        );
      }
      const updatedFreelancer = {
        ...(freelancer as any)._doc,
        invitedStatus: invited.status,
      };
      freelancers.push(updatedFreelancer);
    }

    return freelancers;
  }

  async getSelectedDehixTalent(hireDehixTalent_id: string) {
    this.logger.info("HireService: getSelectedDehixTalent", hireDehixTalent_id);

    const hireDehixTalent =
      await this.HireDAO.findHireDehixTalentById(hireDehixTalent_id);
    if (!hireDehixTalent) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.HIRE_DEHIX_TALENT_NOT_FOUND,
        ERROR_CODES.HIRE_DEHIX_TALENT_NOT_FOUND,
      );
    }

    const response =
      await this.HireDAO.getSelectedDehixTalent(hireDehixTalent_id);

    const freelancers: any[] = [];
    for (const selected of response!.freelancerSelected) {
      const freelancer = await this.FreelancerDAO.findFreelancerById(
        selected.freelancerId,
      );
      if (!freelancer) {
        throw new NotFoundError(
          RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
          ERROR_CODES.NOT_FOUND,
        );
      }
      const updatedFreelancer = {
        ...(freelancer as any)._doc,
        selectedDehixTalentId: selected.dehixTalentId,
      };
      freelancers.push(updatedFreelancer);
    }

    return freelancers;
  }

  async getRejectedDehixTalent(hireDehixTalent_id: string) {
    this.logger.info("HireService: getRejectedDehixTalent", hireDehixTalent_id);

    const hireDehixTalent =
      await this.HireDAO.findHireDehixTalentById(hireDehixTalent_id);
    if (!hireDehixTalent) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.HIRE_DEHIX_TALENT_NOT_FOUND,
        ERROR_CODES.HIRE_DEHIX_TALENT_NOT_FOUND,
      );
    }

    const response =
      await this.HireDAO.getRejectedDehixTalent(hireDehixTalent_id);

    const freelancers: any[] = [];
    for (const rejected of response!.freelancerRejected) {
      const freelancer = await this.FreelancerDAO.findFreelancerById(
        rejected.freelancerId,
      );
      if (!freelancer) {
        throw new NotFoundError(
          RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
          ERROR_CODES.NOT_FOUND,
        );
      }
      const updatedFreelancer = {
        ...(freelancer as any)._doc,
        rejectedDehixTalentId: rejected.dehixTalentId,
      };
      freelancers.push(updatedFreelancer);
    }

    return freelancers;
  }
}
