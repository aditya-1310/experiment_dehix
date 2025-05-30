export interface GetTokenRequestPathParams {
  tokenrequest_id: string;
}

export interface GetTokenRequestByUserIdPathParams {
  user_id: string;
}

export interface GetTokenRequestByUserIdQueryString {
  latestConnects: boolean;
}

export interface GetAllTokenRequestsQueryString {
  limit: string;
  page: string;
}
