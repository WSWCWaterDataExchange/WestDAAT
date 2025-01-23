import React from 'react';
import { useAuthenticationContext } from '../hooks/useAuthenticationContext';
import { Role } from '../config/role';
import { hasOrganizationRole, hasUserRole } from '../utilities/securityHelpers';

interface AuthorizedTemplateProps {
  roles: Role[];
  children: React.ReactNode;
}

const AuthorizedTemplate = (props: AuthorizedTemplateProps) => {
  const authContext = useAuthenticationContext();

  if (!authContext.isAuthenticated) {
    return null;
  }

  const hasRole = props.roles.some((role) => hasUserRole(authContext, role));
  const hasOrgRole = props.roles.some((role) => hasOrganizationRole(authContext, role));

  const hasRequiredRole = hasRole || hasOrgRole;
  return hasRequiredRole ? props.children : null;
};

export default AuthorizedTemplate;
