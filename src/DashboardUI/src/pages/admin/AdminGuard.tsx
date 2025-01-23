import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Role } from '../../config/role';
import { hasOrganizationRole, hasUserRole } from '../../utilities/securityHelpers';
import { useAppContext } from '../../contexts/AppProvider';

export const AdminGuard = () => {
  const {
    authenticationContext: { isAuthenticated, user },
  } = useAppContext();
  const navigate = useNavigate();

  // These are the roles that will need to access admin pages
  const adminRoles = [Role.GlobalAdmin, Role.OrganizationAdmin];

  const hasRole = adminRoles.some((role) => hasUserRole(user, role));
  const hasOrgRole = adminRoles.some((role) => hasOrganizationRole(user, role));
  const isAllowed = hasRole || hasOrgRole;

  // Must wait for the authContext to be set before checking if the user is allowed
  if (isAuthenticated && !isAllowed) {
    navigate('/');
  }

  return <Outlet />;
};
