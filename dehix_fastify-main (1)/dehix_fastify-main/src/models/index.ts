import { Model } from "mongoose";
import { FreelancerModel, IFreelancer } from "./freelancer.entity";
import { BusinessModel, IBusiness } from "./business.entity";
import { ProjectModel, IProject } from "./project.entity";
import { BidModel, IBid } from "./bid.entity";
import { InterviewModel, IInterview } from "./interview.entity";
import { SkillModel, ISkill } from "./skills.entity";
import { HireModel, IHire } from "./hireDehixTalent.entity";
import { FaqModel, IFaq } from "./faq.entity";
import { DomainModel, IDomain } from "./domain.entity";
import { VerificationModel, IVerification } from "./verifications.entity";
import { AdminModel, IAdmin } from "./admin.entity";
import { AdsModel, IAds } from "./ads.entity";
import { ProjectDomainModel, IProjectDomain } from "./projectDomain.entity";

export interface DBModels {
  FreelancerModel?: Model<IFreelancer>;
  BusinessModel?: Model<IBusiness>;
  ProjectModel?: Model<IProject>;
  BidModel?: Model<IBid>;
  InterviewModel?: Model<IInterview>;
  SkillModel?: Model<ISkill>;
  HireModel?: Model<IHire>;
  FaqModel?: Model<IFaq>;
  DomainModel?: Model<IDomain>;
  VerificationModel?: Model<IVerification>;
  AdminModel?: Model<IAdmin>;
  AdsModel?: Model<IAds>;
  ProjectDomainModel?: Model<IProjectDomain>;
}

const models: DBModels = {
  FreelancerModel,
  BusinessModel,
  ProjectModel,
  BidModel,
  InterviewModel,
  SkillModel,
  HireModel,
  FaqModel,
  DomainModel,
  VerificationModel,
  AdminModel,
  AdsModel,
  ProjectDomainModel,
};

export default models;
