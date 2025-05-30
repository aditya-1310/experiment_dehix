export interface UpdateProjectProfilePathParams {
  project_id: string;
  profile_id: string;
}

export interface UpdateProjectProfileBody {
  domain?: string;
  freelancersRequired?: string;
  skills?: string[];
  experience?: number;
  minConnect?: number;
  rate?: number;
  description?: string;
  domain_id?: string;
  selectedFreelancer?: string[];
  totalBid?: string[];
}

export interface UpdateProjectProfileResponse {
  message: string;
  data: {
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
  };
}
