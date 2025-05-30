export interface GetTransactionPathParams {
  transaction_id: string;
}
export interface GetTransactionByTypeQueryParams {
  type: "payment" | "referral" | "rewards" | "system generated";
}
export interface GetTransactionByFromTypeQueryParams {
  from_type: "system" | "freelancer" | "business" | "admin";
}
export interface GetTransactionByFromQueryParams {
  from: string;
}
export interface GetTransactionByToQueryParams {
  to: string;
}
export interface GetTransactionByReferenceIdQueryParams {
  reference_id: string;
}
