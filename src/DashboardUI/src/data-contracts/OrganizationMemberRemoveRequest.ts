import { OrganizationStoreRequestBase } from "./OrganizationStoreRequestBase";

export interface OrganizationMemberRemoveRequest extends OrganizationStoreRequestBase {
  $type: 'OrganizationMemberRemoveRequest';
  organizationId: string;
  userId: string;
}
