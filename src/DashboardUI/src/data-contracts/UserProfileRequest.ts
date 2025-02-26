import { UserLoadRequestBase } from './UserLoadRequestBase';


export interface UserProfileRequest extends UserLoadRequestBase {
  $type: 'UserProfileRequest';
  userId: string;
}
