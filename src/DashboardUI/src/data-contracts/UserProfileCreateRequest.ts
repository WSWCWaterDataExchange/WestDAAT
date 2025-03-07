import { UserStoreRequestBase } from './UserStoreRequestBase';


export interface UserProfileCreateRequest extends UserStoreRequestBase {
  $type: 'UserProfileCreateRequest';
  firstName: string;
  lastName: string;
  state: string;
  country: string;
  phoneNumber: string;
  affiliatedOrganization: string | null;
}
