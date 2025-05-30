export interface PutFaqPathParams {
  faq_id: string;
}

export interface PutFaqBody {
  question?: string;
  answer?: string;
}

export interface PutFaqStatusBody {
  status?: string;
}
