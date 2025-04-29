import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Role } from '../../config/role';
import { hasOrganizationRole, hasUserRole } from '../../utilities/securityHelpers';
import { useAppContext } from '../../contexts/AppProvider';

export const RoleGuard = (props: { allowedRoles: Role[] }) => {
  const {
    authenticationContext: { authenticationComplete, user },
  } = useAppContext();
  const navigate = useNavigate();

  const hasRole = props.allowedRoles.some((role) => hasUserRole(user, role));
  const hasOrgRole = props.allowedRoles.some((role) => hasOrganizationRole(user, role));
  const isAllowed = hasRole || hasOrgRole;

  useEffect(() => {
    // Must wait for the authContext to be set before checking if the user is allowed
    if (authenticationComplete && !isAllowed) {
      navigate('/');
    }
  }, [authenticationComplete, isAllowed, navigate]);

  // Don't render anything until the authentication check is finished above
  if (!authenticationComplete || !isAllowed) {
    return null;
  }

  return <Outlet />;
};
