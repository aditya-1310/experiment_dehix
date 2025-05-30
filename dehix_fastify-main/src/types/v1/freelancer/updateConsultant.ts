import { FreelancerOracleNdConsultantStatusEnum } from "../../../models/freelancer.entity";

export interface PutConsultantBody {
  status: FreelancerOracleNdConsultantStatusEnum;
  description: string;
  price: number;
  experience: string;
  links: string[];
}
export interface PutconsultantPathParams {
  consultant_id: string;
}
