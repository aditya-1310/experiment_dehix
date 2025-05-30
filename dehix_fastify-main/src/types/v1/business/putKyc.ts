import { KycBusinessStatusEnum } from "../../../models/business.entity";

export interface PutBusinessKycBody {
  businessProof: string;
  verification: string;
  frontImageUrl: string;
  backImageUrl: string;
  liveCapture: string;
  status: KycBusinessStatusEnum;
  createdAt: string;
  updatedAt: string;
}
