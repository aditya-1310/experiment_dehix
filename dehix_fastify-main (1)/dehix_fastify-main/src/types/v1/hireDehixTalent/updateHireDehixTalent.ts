import {
  FreelancerInvitedStatusEnum,
  HireDehixTalentStatusEnum,
} from "../../../models/hireDehixTalent.entity";

export interface HireDehixTalentPathParams {
  hireDehixTalent_id: string;
}

export interface PutHireDehixTalentBody {
  _id: string;
  business_id: string;
  domainId: string;
  domainName: string;
  skillId: string;
  skillName: string;
  description: string;
  experience: string;
  freelancerRequired: string;
  status: HireDehixTalentStatusEnum;
  visible: boolean;
  freelancerApplied: any[];
  freelancerSelected: any[];
}

export interface PutStatusHireDehixTalent {
  status: HireDehixTalentStatusEnum;
  visible: boolean;
}

export interface PutHireDehixTalentBookmarkedBody {
  bookmarked: boolean;
}

export interface AddDehixTalentInInvitedBody {
  freelancerId: string;
  status: FreelancerInvitedStatusEnum;
}
