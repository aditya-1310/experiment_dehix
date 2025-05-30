import { KycStatusEnum } from "../../../models/freelancer.entity";

export interface PutKycBody {
  aadharOrGovtId: string;
  frontImageUrl: string;
  backImageUrl: string;
  liveCapture: string;
  status: KycStatusEnum;
  createdAt: string;
  updatedAt: string;
}
