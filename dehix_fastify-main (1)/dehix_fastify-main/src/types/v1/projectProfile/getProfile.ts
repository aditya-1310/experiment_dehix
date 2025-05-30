export interface GetProjectProfilePathParams {
  project_id: string;
  profile_id: string;
}

export interface GetProjectProfileResponse {
  _id: string;
  domain: string;
  freelancersRequired: string;
  skills: string[];
  experience: number;
  minConnect: number;
  rate: number;
  description: string;
  domain_id: string;
  selectedFreelancer: string[];
  totalBid: string[];
}
