import { Role } from '../config/role';


export interface OrganizationMembership {
  organizationId: string;
  organizationName: string;
  role: Role;
}
