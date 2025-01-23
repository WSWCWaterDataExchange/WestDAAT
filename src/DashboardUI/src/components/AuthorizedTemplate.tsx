import React from 'react';
import { Role } from '../config/role';
import { hasOrganizationRole, hasUserRole } from '../utilities/securityHelpers';
import { useAppContext } from '../contexts/AppProvider';

interface AuthorizedTemplateProps {
  roles: Role[];
  children: React.ReactNode;
}

const AuthorizedTemplate = (props: AuthorizedTemplateProps) => {
  const {
    authenticationContext: { isAuthenticated, user },
  } = useAppContext();

  if (!isAuthenticated) {
    return null;
  }

  const hasRole = props.roles.some((role) => hasUserRole(user, role));
  const hasOrgRole = props.roles.some((role) => hasOrganizationRole(user, role));

  const hasRequiredRole = hasRole || hasOrgRole;
  return hasRequiredRole ? props.children : null;
};

export default AuthorizedTemplate;
