import { UserLoadResponseBase } from './UserLoadResponseBase';
import { UserSearchResult } from './UserSearchResult';

export interface UserSearchResponse extends UserLoadResponseBase {
  searchResults: UserSearchResult[];
}
