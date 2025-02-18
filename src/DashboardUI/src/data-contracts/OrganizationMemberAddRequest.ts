import { OrganizationStoreRequestBase } from './OrganizationStoreRequestBase';

export interface OrganizationMemberAddRequest extends OrganizationStoreRequestBase {
  $type: 'OrganizationMemberAddRequest';
  userId: string;
  role: string;
}
