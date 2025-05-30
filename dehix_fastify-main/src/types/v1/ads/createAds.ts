import { AdsStatusEnum, AdsTypeEnum } from "../../../models/ads.entity";

export interface CreateAdsBody {
  heading: string;
  description: string;
  type: AdsTypeEnum;
  status: AdsStatusEnum;
  background_img?: string;
  importantUrl?: {
    urlName: string;
    url: string;
  }[];
}
