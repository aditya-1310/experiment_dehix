export interface GetBusinessPathParams {
  project_id: string;
  business_id: string;
  freelancer_id: string;
}

export interface BusinessBody {
  _id: string;
  firstName: string;
  lastName: string;
  companyName: string;
  profilePic: string;
  companySize: string;
  password: string;
  email: string;
  phone: string;
  phoneVerify: boolean;
  position?: string;
  refer?: string;
  verified?: any;
  isVerified: boolean;
  linkedin?: string;
  personalWebsite?: string;
  isBusiness: boolean;
  connects: number;
  ProjectList: string[];
}
