import React from 'react';
import { useAuthenticationContext } from '../hooks/useAuthenticationContext';
import { Role } from '../config/role';

interface AuthorizedTemplateProps {
  roles: Role[];
  children: React.ReactNode;
}

const AuthorizedTemplate = (props: AuthorizedTemplateProps) => {
  const authContext = useAuthenticationContext();

  if (!authContext.isAuthenticated) {
    return null;
  }

  const hasUserRole = authContext.user?.roles?.some((role) => props.roles.includes(role));
  const hasOrganizationRole = authContext.user?.organizationRoles?.some((organizationRole) =>
    organizationRole.roles.some((role) => props.roles.includes(role)),
  );
  const hasRequiredRole = hasUserRole || hasOrganizationRole;

  return hasRequiredRole ? props.children : null;
};

export default AuthorizedTemplate;
