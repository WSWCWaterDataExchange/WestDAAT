import { UserLoadRequestBase } from "./UserLoadRequestBase";

export interface OrganizationUserListRequest extends UserLoadRequestBase {
  $type: 'OrganizationUserListRequest';
  organizationId: string;
}