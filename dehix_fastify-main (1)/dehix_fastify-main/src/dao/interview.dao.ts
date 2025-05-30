import { Service } from "fastify-decorators";
import { Model } from "mongoose";
import { BaseDAO } from "../common/base.dao";
import { IInterview2, InterviewModel } from "../models/interview.entity";
import { v4 as uuid4 } from "uuid";
import { FreelancerModel, IFreelancer } from "../models/freelancer.entity";
import { ISkill, SkillModel } from "../models/skills.entity";
import { DomainModel, IDomain } from "../models/domain.entity";

@Service()
export class InterviewDao extends BaseDAO {
  model: Model<IInterview2>;
  freelancerModel: Model<IFreelancer>;
  skillModel: Model<ISkill>;
  domainModel: Model<IDomain>;
  constructor() {
    super();
    this.model = InterviewModel;
    this.freelancerModel = FreelancerModel;
    this.skillModel = SkillModel;
    this.domainModel = DomainModel;
  }

  async createInterview(data: string) {
    return this.model.create(data);
  }

  async getInterviewById(interviewId: string) {
    return this.model.findById(interviewId);
  }

  async getInterviewByInterviewerId(interviewerId: string) {
    const interviews = await this.model.find({ interviewerId }).lean();

    const { interviewerIds } = this.extractIds(interviews);
    const freelancerMap = await this.getFreelancerInfo(interviewerIds);

    for (const interview of interviews) {
      if (interview.talentId && interview.talentType) {
        interview.talentId = await this.getTalentInfo(
          interview.talentId,
          interview.talentType,
        );
      }
    }

    this.attachDetails(interviews, freelancerMap);

    return interviews;
  }

  async getInterviewByIntervieweeId(intervieweeId: string) {
    const interviews = await this.model.find({ intervieweeId }).lean();

    const { interviewerIds } = this.extractIds(interviews);
    const freelancerMap = await this.getFreelancerInfo(interviewerIds);

    for (const interview of interviews) {
      if (interview.talentId && interview.talentType) {
        interview.talentId = await this.getTalentInfo(
          interview.talentId,
          interview.talentType,
        );
      }
    }

    this.attachDetails(interviews, freelancerMap);

    return interviews;
  }

  async getInterviewByCreatorId(creatorId: string) {
    const interviews = await this.model.find({ creatorId }).lean();

    const { interviewerIds } = this.extractIds(interviews);
    const freelancerMap = await this.getFreelancerInfo(interviewerIds);

    for (const interview of interviews) {
      if (interview.talentId && interview.talentType) {
        interview.talentId = await this.getTalentInfo(
          interview.talentId,
          interview.talentType,
        );
      }
    }

    this.attachDetails(interviews, freelancerMap);

    return interviews;
  }

  async getAllInterviews(query: any, page: string, limit: string) {
    const pages = parseInt(page) - 1;
    const pageSize = parseInt(limit);
    const pageIndex = pages * pageSize;

    const interviews = await this.model
      .find(query)
      .skip(pageIndex)
      .limit(pageSize)
      .lean();

    const pendingInterviews = interviews.filter(
      (interview) => interview.InterviewStatus === "BIDDING",
    );

    const { interviewerIds } = this.extractIds(pendingInterviews);

    const freelancerMap = await this.getFreelancerInfo(interviewerIds);

    for (const interview of pendingInterviews) {
      if (interview.talentId && interview.talentType) {
        interview.talentId = await this.getTalentInfo(
          interview.talentId,
          interview.talentType,
        );
      }
    }

    this.attachDetails(pendingInterviews, freelancerMap);

    return pendingInterviews;
  }

  private extractIds(interviews: any[]) {
    const interviewerIds = new Set<string>();

    for (const interview of interviews) {
      if (interview.interviewBids) {
        for (const bidId in interview.interviewBids) {
          const bid = interview.interviewBids[bidId];
          interviewerIds.add(bid.interviewerId);
        }
      }
    }

    return { interviewerIds: Array.from(interviewerIds) };
  }

  private async getFreelancerInfo(interviewerIds: string[]) {
    const freelancers = await this.freelancerModel
      .find({ _id: { $in: interviewerIds } })
      .select("userName skills workExperience")
      .populate({ path: "skills", select: "name" })
      .lean();

    return new Map(
      freelancers.map((freelancer) => [
        freelancer._id.toString(),
        {
          ...freelancer,
          skills: freelancer.skills
            ? [...new Set(freelancer.skills.map((skill) => skill.name))]
            : [],
        },
      ]),
    );
  }

  private async getTalentInfo(talentId: string, talentType: string) {
    let talent;
    if (talentType === "SKILL") {
      talent = await this.skillModel
        .findById(talentId)
        .select("_id label")
        .lean();
    } else if (talentType === "DOMAIN") {
      talent = await this.domainModel
        .findById(talentId)
        .select("_id label")
        .lean();
    }

    // Map talentId -> Talent info (including ID)
    return talent
      ? { id: talent._id.toString(), label: talent.label, type: talentType }
      : null;
  }

  private attachDetails(interviews: any[], freelancerMap: Map<string, any>) {
    for (const interview of interviews) {
      if (interview.interviewBids) {
        for (const bidId in interview.interviewBids) {
          const bid = interview.interviewBids[bidId];

          // Attach freelancer info
          if (freelancerMap.has(bid.interviewerId)) {
            bid.interviewer = freelancerMap.get(bid.interviewerId);
          }
        }
      }
    }
  }

  async getInterviewsByTalentIds(talentIds: string[]) {
    return await this.model.find({
      talentId: { $in: talentIds },
    });
  }

  async updateInterviewById(interview_id: string, update: any) {
    return this.model.findOneAndUpdate({ _id: interview_id }, update, {
      new: true,
    });
  }

  async deleteInterviewById(interviewId: string) {
    return this.model.findOneAndDelete({ _id: interviewId });
  }

  async getInterviewByRating(rating: number) {
    return this.model.find({ rating: rating });
  }

  async getInterviewBidsByInterviewBidId(interviewId: string, bidId: string) {
    const interviewBids = await this.model.findOne(
      { _id: interviewId, [`interviewBids.${bidId}`]: { $exists: true } },
      { "interviewBids.$": 1 },
    );
    return interviewBids?.interviewBids?.get(bidId);
  }

  async getAllInterviewBidsByInterviewId(interviewId: string) {
    return this.model.findOne({ _id: interviewId }, { interviewBids: 1 });
  }

  async getAllInterviewBidsByInterviewerId(interviewerId: string) {
    return this.model.find({ "interviewBids.interviewerId": interviewerId });
  }

  async createInterviewBid(interviewId: string, data: any) {
    const bidId = uuid4();
    const updateInterview = await this.model.findByIdAndUpdate(
      interviewId,
      {
        $set: {
          [`interviewBids.${bidId}`]: {
            _id: bidId,
            ...data,
          },
        },
      },
      { new: true, upsert: true },
    );
    return updateInterview.interviewBids!.get(bidId);
  }

  async updateInterviewBid(interviewId: string, bidId: string, data: any) {
    const updateData = Object.entries(data).reduce((acc, [key, value]) => {
      acc[`interviewBids.${bidId}.${key}`] = value;
      return acc;
    }, {});

    const updatedInterview = await this.model.findOneAndUpdate(
      {
        _id: interviewId,
        [`interviewBids.${bidId}`]: { $exists: true },
      },
      { $set: updateData },
      { new: true },
    );

    const updatedBid = updatedInterview!.interviewBids!.get(bidId);
    return updatedBid;
  }

  async deleteInterviewBid(interviewId: string, bidId: string) {
    return this.model.findOneAndUpdate(
      { _id: interviewId },
      { $unset: { [`interviewBids.${bidId}`]: 1 } },
      { new: true },
    );
  }

  async selectInterviewBid(interviewId: string, bid: any) {
    const updatedInterview = await this.model.findOneAndUpdate(
      { _id: interviewId },
      { $set: { interviewerId: bid.interviewerId } },
      { new: true, upsert: true },
    );
    return updatedInterview;
  }
}
