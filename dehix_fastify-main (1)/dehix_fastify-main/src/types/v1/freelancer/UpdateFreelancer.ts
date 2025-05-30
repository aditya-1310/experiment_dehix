import { FreelancerStatusEnum } from "../../../models/freelancer.entity";

export interface PutStatusFreelancerBody {
  status: FreelancerStatusEnum;
}
