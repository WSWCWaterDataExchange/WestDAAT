import { UserListResult } from './UserListResult';
import { UserLoadResponseBase } from './UserLoadResponseBase';

export interface UserListResponse extends UserLoadResponseBase {
  users: UserListResult[];
}
