export interface InterviewBody {
  interviewerId?: string;
  intervieweeId: string;
  interviewType: string;
  description?: string;
  creatorId: string;
  talentType: string;
  talentId: string;
  interviewDate: Date;
  intervieweeDateTimeAgreement?: boolean;
  interviewBids?: {
    interviewerId: string;
    dateTimeAgreement: boolean;
    suggestedDateTime: Date;
    fee: string;
  };
  rating?: number;
  comments?: string;
}

export interface CreateInterviewPathParams {
  creator_id: string;
}

export interface InterviewBidBody {
  interviewerId: string;
  dateTimeAgreement: boolean;
  suggestedDateTime: Date;
  fee: string;
}

export interface CreateInterviewBidPathParams {
  interview_id: string;
}
