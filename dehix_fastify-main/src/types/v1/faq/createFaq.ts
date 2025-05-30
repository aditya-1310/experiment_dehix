import { FaqTypeEnum, StatusEnum } from "src/models/faq.entity";

export interface CreateFaqBody {
  question: string;
  answer: string;
  type: FaqTypeEnum;
  status: StatusEnum;
  importantUrl?: {
    urlName: string;
    url: string;
  }[];
}
