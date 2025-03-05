import { Role } from "../config/role";
import { OrganizationStoreRequestBase } from "./OrganizationStoreRequestBase";

export interface OrganizationMemberUpdateRequest extends OrganizationStoreRequestBase {
  $type: 'OrganizationMemberUpdateRequest';
  organizationId: string;
  userId: string;
  role: string;
}
