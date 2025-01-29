import { Role } from '../config/role';
import { User } from '../hooks/useAuthenticationContext';

export const hasUserRole = (user: User | null, role: Role): boolean => {
  return user?.roles?.some((userRole) => userRole === role) ?? false;
};

export const hasOrganizationRole = (user: User | null, role: Role): boolean => {
  return (
    user?.organizationRoles?.some((organizationRole) => organizationRole.roles.some((userRole) => userRole === role)) ??
    false
  );
};

export const canViewOrgList = (user: User | null): boolean => {
  return hasUserRole(user, Role.GlobalAdmin);
};

export const canViewUsersList = (user: User | null): boolean => {
  return hasUserRole(user, Role.OrganizationAdmin) || hasUserRole(user, Role.GlobalAdmin);
};
