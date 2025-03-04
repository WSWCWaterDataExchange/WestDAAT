import { UserStoreRequestBase } from './UserStoreRequestBase';

export interface UserProfileUpdateRequest extends UserStoreRequestBase {
  $type: 'UserProfileUpdateRequest';
  firstName: string;
  lastName: string;
  state: string;
  country: string;
  phoneNumber: string;
}
