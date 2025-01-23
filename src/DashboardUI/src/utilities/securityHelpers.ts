import { Role } from '../config/role';
import { IAuthenticationContext } from '../hooks/useAuthenticationContext';

export const hasUserRole = (authContext: IAuthenticationContext, role: Role): boolean => {
  return authContext.user?.roles?.some((userRole) => userRole === role) ?? false;
};

export const hasOrganizationRole = (authContext: IAuthenticationContext, role: Role): boolean => {
  return (
    authContext.user?.organizationRoles?.some((organizationRole) =>
      organizationRole.roles.some((userRole) => userRole === role),
    ) ?? false
  );
};
