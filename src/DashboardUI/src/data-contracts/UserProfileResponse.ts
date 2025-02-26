import { UserLoadResponseBase } from './UserLoadResponseBase';
import { UserProfile } from './UserProfile';

export interface UserProfileResponse extends UserLoadResponseBase {
  userProfile: UserProfile;
}
