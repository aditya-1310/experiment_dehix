export interface PutAdminPathParams {
  admin_id: string;
}
export interface PutAdminBody {
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phone: string;
  profilePic?: string;
  status: string;
}
