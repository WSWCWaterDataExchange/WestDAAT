import React from 'react';
import { useAuthenticationContext } from '../../hooks/useAuthenticationContext';
import { Outlet, useNavigate } from 'react-router-dom';
import { Role } from '../../config/role';
import { hasOrganizationRole, hasUserRole } from '../../utilities/securityHelpers';

export const AdminGuard = () => {
  const authContext = useAuthenticationContext();
  const navigate = useNavigate();

  // These are the roles that will need to access admin pages
  const adminRoles = [Role.GlobalAdmin, Role.OrganizationAdmin];

  const hasRole = adminRoles.some((role) => hasUserRole(authContext, role));
  const hasOrgRole = adminRoles.some((role) => hasOrganizationRole(authContext, role));
  const isAllowed = hasRole || hasOrgRole;

  // Must wait for the authContext to be set before checking if the user is allowed
  if (authContext.isAuthenticated && !isAllowed) {
    navigate('/');
  }

  return <Outlet />;
};
