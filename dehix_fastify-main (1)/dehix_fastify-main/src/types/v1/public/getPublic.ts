export interface getUserQuery {
  user_ids: string | string[];
}
export interface getUserNameQuery {
  username: string | string[];
}
export interface getUserEmailQuery {
  user: string;
}

export interface checkDuplicateUserNameQueryString {
  username: string;
  is_freelancer: boolean;
  is_business: boolean;
}
