export interface createAdminBody {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  email: string;
  phone?: string;
  status?: "Pending" | "Accept" | "Reject";
  type?: "Admin" | "Super_Admin";
}
