import { KycStatusEnum } from "../../../models/freelancer.entity";

export interface CreatekycBody {
  aadharOrGovId: string;
  frontImageUrl: string;
  backImageUrl: string;
  liveCapture: Date;
  status: KycStatusEnum;
  createdAt: string;
  updatedAt: string;
}
