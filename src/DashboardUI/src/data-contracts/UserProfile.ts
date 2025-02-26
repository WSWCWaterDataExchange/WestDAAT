import { OrganizationMembership } from './OrganizationMembership';


export interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  state: string;
  country: string;
  phoneNumber: string;
  organizationMemberships: OrganizationMembership[];
}
