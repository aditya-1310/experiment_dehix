import { Inject, Service } from "fastify-decorators";
import { BaseService } from "../common/base.service";
import { ERROR_CODES, RESPONSE_MESSAGE } from "../common/constants";
import { NotFoundError } from "../common/errors";
import { FreelancerDAO } from "../dao";
import { InterviewDao } from "../dao/interview.dao";
import { InterviewStatus } from "../models/interview.entity";

@Service()
export class InterviewService extends BaseService {
  @Inject(InterviewDao)
  private interviewDao!: InterviewDao;

  @Inject(FreelancerDAO)
  private freelancerDao!: FreelancerDAO;

  async createInterview(interview_data: any) {
    this.logger.info("service->interview.service->createInterview");
    const intervieweeId = interview_data.intervieweeId;
    // const interviewerId = interview_data.interviewerId;
    const intervieweeExist =
      await this.freelancerDao.findFreelancerById(intervieweeId);
    if (!intervieweeExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }

    // const interviewerExist =
    //   await this.freelancerDao.findFreelancerById(interviewerId);
    // if (!interviewerExist) {
    //   throw new NotFoundError(
    //     RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
    //     ERROR_CODES.FREELANCER_NOT_FOUND,
    //   );
    // }

    const data = await this.interviewDao.createInterview({
      ...interview_data,
    });
    return data;
  }

  async updateInterview(interview_id: string, update: any) {
    this.logger.info("service->interview.service->updateInterview");

    const interviewExist =
      await this.interviewDao.getInterviewById(interview_id);

    if (!interviewExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.INTERVIEW_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }

    const updatedInterview = await this.interviewDao.updateInterviewById(
      interview_id,
      update,
    );

    if (updatedInterview?.InterviewStatus === "SCHEDULED") {
      const selectedInterviewerId = this.getSelectedInterviewerId(
        updatedInterview.interviewBids,
      );

      if (selectedInterviewerId) {
        await this.deductInterviewerConnects(selectedInterviewerId);
      }
    }

    return updatedInterview;
  }

  private getSelectedInterviewerId(
    interviewBids: Map<string, any> | undefined,
  ): string | null {
    if (!interviewBids) return null;

    for (const bid of interviewBids.values()) {
      if (bid.status === "ACCEPTED") {
        return bid.interviewerId;
      }
    }
    return null;
  }

  private async deductInterviewerConnects(
    interviewerId: string,
  ): Promise<void> {
    const interviewer =
      await this.freelancerDao.findFreelancerById(interviewerId);
    if (interviewer) {
      const updatedConnects = Math.max(0, (interviewer.connects ?? 0) - 100);
      await this.freelancerDao.updateFreelancer(
        { _id: interviewerId },
        { connects: updatedConnects },
      );
    }
  }

  async deleteInterview(interview_id: string) {
    this.logger.info("service->interview.service->deleteInterview");

    const interviewExist =
      await this.interviewDao.getInterviewById(interview_id);
    if (!interviewExist) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.INTERVIEW_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }

    const data = await this.interviewDao.deleteInterviewById(interview_id);
    return data;
  }

  async getAllInterviews(
    intervieweeId: string | null,
    interviewerId: string | null,
    interviewType: string | null,
    talentType: string | null,
    talentId: string | null,
    page: string,
    limit: string,
  ) {
    this.logger.info("service->interview.service->getAllInterview");

    const query: any = {};
    if (intervieweeId) query.intervieweeId = intervieweeId;
    if (interviewerId) query.interviewerId = interviewerId;
    if (talentType) query.talentType = talentType;
    if (talentId) query.talentId = talentId;
    this.logger.info(query);
    const data = await this.interviewDao.getAllInterviews(query, page, limit);

    this.logger.info("data: ", data);
    return data;
  }

  async getSingleInterview(interview_id: string) {
    this.logger.info("service->interview.service->getSingleInterview");
    const data = await this.interviewDao.getInterviewById(interview_id);
    if (!data) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.INTERVIEW_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }
    return data;
  }

  async getInterviewByInterviewerId(interviewer_id: string) {
    this.logger.info("service->interview.service->getInterviewByInterviewerId");
    const data =
      await this.interviewDao.getInterviewByInterviewerId(interviewer_id);
    if (!data) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.INTERVIEW_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }
    return data;
  }

  async getInterviewByIntervieweeId(intervieweeId: string) {
    this.logger.info("service->interview.service->getInterviewByIntervieweeId");
    const data =
      await this.interviewDao.getInterviewByIntervieweeId(intervieweeId);
    if (!data) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.INTERVIEW_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }
    return data;
  }

  async getInterviewByCreatorId(creatorId: string) {
    this.logger.info("service->interview.service->getInterviewByCreatorId");
    const data = await this.interviewDao.getInterviewByCreatorId(creatorId);
    if (!data) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.INTERVIEW_NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
      );
    }
    return data;
  }

  async currentInterview(
    getById: any,
    isInterviewer: boolean,
    isInterviewee: boolean,
    isCreator: boolean,
    id: any,
  ) {
    let data: any = [];

    if (isInterviewer) {
      data = await this.interviewDao.getInterviewByInterviewerId(id);
    } else if (isInterviewee) {
      data = await this.interviewDao.getInterviewByIntervieweeId(id);
    } else if (isCreator) {
      data = await this.interviewDao.getInterviewByCreatorId(id);
    }

    if (!data) {
      throw new Error("Interview not found");
    }

    const currentDate = new Date();

    const validInterviews = data.filter(
      (interview) =>
        new Date(interview.interviewDate) > currentDate &&
        (interview.InterviewStatus === "SCHEDULED" ||
          interview.InterviewStatus === "ONGOING"),
    );

    if (validInterviews.length === 0) {
      return null;
    }

    return {
      dehixTalent: validInterviews.filter((i) => i.interviewType === "TALENT"),
      projects: validInterviews.filter((i) => i.interviewType === "BUSINESS"),
    };
  }

  async completedinterview(getById: any) {
    const data: any = await this.interviewDao.getInterviewById(getById);
    if (!data) {
      throw new Error("Interview not found");
    }

    const interviewDate = await data.interviewDate;
    const currentDate = new Date();
    if (
      data.InterviewStatus === InterviewStatus.SCHEDULED &&
      interviewDate < currentDate
    ) {
      return data;
    }
  }

  async getInterviewBidsByInterviewerId(interviewerId: string) {
    const data =
      await this.interviewDao.getAllInterviewBidsByInterviewerId(interviewerId);

    if (!data) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Interview Bids not found"),
        ERROR_CODES.NOT_FOUND,
      );
    }
    return data;
  }

  async getInterviewBidsByInterviewId(interviewId: string) {
    this.logger.info("service->interview.service->getInterviewBids");
    const interview: any =
      // await this.interviewDao.getAllInterviewBidsByInterviewId(interviewId);
      await this.interviewDao.getInterviewById(interviewId);

    if (!interview) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Interview Bids not found"),
        ERROR_CODES.NOT_FOUND,
      );
    }

    const interviewBidsArray = Array.from(interview.interviewBids).reduce<
      any[]
    >((result, [_, value]: any) => {
      if (value) {
        result.push(value);
      }
      return result;
    }, []);
    interview._doc.interviewBids = interviewBidsArray;

    return interview;
  }

  async createInterviewBid(interviewId: string, body: any) {
    const interview = this.interviewDao.getInterviewById(interviewId);
    if (!interview) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Interview not found"),
        ERROR_CODES.NOT_FOUND,
      );
    }

    const interviewer = await this.freelancerDao.findFreelancerById(
      body.interviewerId,
    );
    if (!interviewer) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Interviewer not found"),
        ERROR_CODES.NOT_FOUND,
      );
    }

    const data = await this.interviewDao.createInterviewBid(interviewId, body);

    return data;
  }

  async updateInterviewBid(interviewId: string, bidId: string, body: any) {
    this.logger.info("service->interview.service->updateInterviewBid");
    const interview = this.interviewDao.getInterviewById(interviewId);
    if (!interview) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Interview not found"),
        ERROR_CODES.NOT_FOUND,
      );
    }

    const interviewBid =
      await this.interviewDao.getInterviewBidsByInterviewBidId(
        interviewId,
        bidId,
      );
    if (!interviewBid) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Interview Bid not found"),
        ERROR_CODES.NOT_FOUND,
      );
    }
    this.logger.info("the bid: ", interviewBid);

    const data = await this.interviewDao.updateInterviewBid(
      interviewId,
      bidId,
      body,
    );

    this.logger.info("all bids: ", data);
    // const transformedData = data.interviewBids
    //   ? Array.from(data.interviewBids.entries()).map(([key, value]) => ({
    //       _id: value._id,
    //       interviewerId: value.interviewerId, // Using key from the Map
    //       dateTimeAgreement: value.dateTimeAgreement,
    //       suggestedDateTime: value.suggestedDateTime,
    //       fee: value.fee,
    //     }))
    //   : [];
    return data;
    // return transformedData;
  }

  async deleteInterviewBid(interviewId: string, bidId: string) {
    const interview = this.interviewDao.getInterviewById(interviewId);
    if (!interview) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Interview not found"),
        ERROR_CODES.NOT_FOUND,
      );
    }

    const interviewBid =
      await this.interviewDao.getInterviewBidsByInterviewBidId(
        interviewId,
        bidId,
      );
    if (!interviewBid) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Interview Bid not found"),
        ERROR_CODES.NOT_FOUND,
      );
    }

    const data = await this.interviewDao.deleteInterviewBid(interviewId, bidId);
    return data;
  }

  async selectInterviewBid(interviewId: string, bidId: string) {
    this.logger.info("service->interview.service->selectInterviewBid");
    const interview = this.interviewDao.getInterviewById(interviewId);
    if (!interview) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Interview not found"),
        ERROR_CODES.NOT_FOUND,
      );
    }

    const interviewBid =
      await this.interviewDao.getInterviewBidsByInterviewBidId(
        interviewId,
        bidId,
      );
    if (!interviewBid) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Interview Bid not found"),
        ERROR_CODES.NOT_FOUND,
      );
    }
    this.logger.info(interviewBid);
    const data = await this.interviewDao.selectInterviewBid(
      interviewId,
      interviewBid,
    );
    this.logger.info(data);
    return data;
  }

  async getInterviewersByTalent(talentId: string) {
    this.logger.info("service->interview.service->getInterviewersByTalent");

    const freelancers: any = await this.freelancerDao.getAllDehixInteviewers();
    if (!freelancers) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.NOT_FOUND("Interviewers not found"),
        ERROR_CODES.NOT_FOUND,
      );
    }

    const filteredFreelancers = freelancers.filter((freelancer) => {
      const interviewersArray = Array.from(
        freelancer.dehixInterviewer.values(),
      );

      return interviewersArray.some((interviewer: any) => {
        const matches =
          interviewer.status === "VERIFIED" &&
          interviewer.activeStatus === true &&
          interviewer.talentId === talentId;
        return matches;
      });
    });

    return filteredFreelancers;
  }

  async getInterviewsByInterviewerTalent(interviewerId: string) {
    this.logger.info(
      "service->interview.service->getInterviewsByInterviewerTalent",
    );
    const freelancer =
      await this.freelancerDao.findFreelancerById(interviewerId);
    if (!freelancer) {
      throw new NotFoundError(
        RESPONSE_MESSAGE.FREELANCER_NOT_FOUND,
        ERROR_CODES.FREELANCER_NOT_FOUND,
      );
    }
    this.logger.info(freelancer);

    const freelancerData: any =
      await this.freelancerDao.getDehixInterviewer(interviewerId);
    if (!freelancerData || !freelancerData.dehixInterviewer) {
      return [];
    }

    const verifiedTalentIds = Array.from(
      freelancerData.dehixInterviewer.values(),
    )
      .filter(
        (entry: any) =>
          entry.status === "VERIFIED" && entry.activeStatus === true,
      )
      .map((entry: any) => entry.talentId);

    this.logger.info(verifiedTalentIds);
    const interviews =
      await this.interviewDao.getInterviewsByTalentIds(verifiedTalentIds);

    this.logger.info(interviews);
    return interviews;
  }
}
