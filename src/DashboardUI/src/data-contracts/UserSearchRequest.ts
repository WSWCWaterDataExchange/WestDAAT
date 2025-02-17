import { UserLoadRequestBase } from './UserLoadRequestBase';

export interface UserSearchRequest extends UserLoadRequestBase {
  $type: 'UserSearchRequest';
  searchTerm: string;
}
