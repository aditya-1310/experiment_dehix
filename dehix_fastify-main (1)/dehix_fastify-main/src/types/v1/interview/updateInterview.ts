export interface UpdateInterviewBody {
  interviewerId: string;
  intervieweeId: string;
  interviewType: string;
  description: string;
  creatorId: string;
  talentType: string;
  talentId: string;
  interviewDate: Date;
  intervieweeDateTimeAgreement: boolean;
  interviewBids: {
    interviewerId: string;
    dateTimeAgreement: boolean;
    suggestedDateTime: Date;
    fee: string;
  };
  rating: number;
  comments?: string;
}

export interface UpdateInterviewBidBody {
  dateTimeAgreement: boolean;
  suggestedDateTime: Date;
  fee: string;
}

export interface updateInterviewBidPathParams {
  interview_id: string;
  bid_id: string;
}
