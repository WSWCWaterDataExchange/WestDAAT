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

export const getUserOrganization = (user: User | null): string | null => {
  // Assumes user only has one organization
  return user?.organizationRoles?.[0]?.organizationId ?? null;
};
