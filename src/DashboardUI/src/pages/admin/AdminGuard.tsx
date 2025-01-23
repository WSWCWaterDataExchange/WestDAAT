import React from 'react';
import { useAuthenticationContext } from '../../hooks/useAuthenticationContext';
import { Navigate, Outlet } from 'react-router-dom';
import { Role } from '../../config/role';
import { hasOrganizationRole, hasUserRole } from '../../utilities/securityHelpers';

export const AdminGuard = () => {
  const authContext = useAuthenticationContext();

  if (!authContext.isAuthenticated) {
    return <Navigate to="/" />;
  }

  // These are the roles that will need to access admin pages
  const adminRoles = [Role.GlobalAdmin, Role.OrganizationAdmin];

  const hasRole = adminRoles.some((role) => hasUserRole(authContext, role));
  const hasOrgRole = adminRoles.some((role) => hasOrganizationRole(authContext, role));
  const isAllowed = hasRole || hasOrgRole;

  return isAllowed ? <Outlet /> : <Navigate to="/" replace={true} />;
};
