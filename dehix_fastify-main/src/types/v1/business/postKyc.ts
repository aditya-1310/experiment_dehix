import { KycBusinessStatusEnum } from "../../../models/business.entity";

export interface PostBusinessKycBody {
  businessProof: string;
  verification: string;
  frontImageUrl: string;
  backImageUrl: string;
  liveCapture: string;
  status: KycBusinessStatusEnum;
}
