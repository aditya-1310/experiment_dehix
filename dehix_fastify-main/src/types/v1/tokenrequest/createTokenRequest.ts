import {
  TokenRequestStatus,
  UserType,
} from "../../../models/tokenrequest.entity";

export interface CreateTokenRequestBody {
  userId: string;
  userType?: UserType;
  amount: string;
  transactionId?: string;
  status: TokenRequestStatus;
  dateTime?: Date;
}
