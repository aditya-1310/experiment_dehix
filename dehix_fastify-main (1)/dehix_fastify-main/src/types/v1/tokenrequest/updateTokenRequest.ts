import {
  TokenRequestStatus,
  UserType,
} from "../../../models/tokenrequest.entity";

export interface UpdateTokenRequestBody {
  userType?: UserType;
  amount: string;
  transactionId?: string;
  status: TokenRequestStatus;
  dateTime?: Date;
}

export interface UpdateTokenRequestStatusBody {
  status: TokenRequestStatus;
}
