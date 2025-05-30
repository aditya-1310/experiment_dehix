export interface BidApplyBody {
  bidder_id: string;
  project_id: string;
  domain_id: string;
  current_price: number;
  biddingValue: number;
  description: string;
  profile_id: string;
}
