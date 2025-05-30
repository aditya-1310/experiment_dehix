import { StatusEnum } from "../../../models/bid.entity";

export interface PutBidPathParams {
  bid_id: string;
}

export interface PutBidBody {
  current_price: number;
  domain_id: string;
}

export interface BidStatusBody {
  bid_status: StatusEnum;
}
