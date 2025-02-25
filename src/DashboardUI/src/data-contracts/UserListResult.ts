import { Role } from "../config/role";

export interface UserListResult {
  userId: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}