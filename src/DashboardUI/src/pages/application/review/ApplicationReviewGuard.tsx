import { Outlet, useNavigate } from 'react-router-dom';
import { Role } from '../../../config/role';
import { hasOrganizationRole, hasUserRole } from '../../../utilities/securityHelpers';
import { useAppContext } from '../../../contexts/AppProvider';

export const ApplicationReviewGuard = () => {
  const {
    authenticationContext: { isAuthenticated, user },
  } = useAppContext();
  const navigate = useNavigate();

  const authorizedRoles: Role[] = [Role.GlobalAdmin, Role.OrganizationAdmin, Role.TechnicalReviewer, Role.Member];

  const hasRequiredRole = authorizedRoles.some((role): boolean => {
    return hasUserRole(user, role) || hasOrganizationRole(user, role);
  });

  // Must wait for the authContext to be set before checking if the user is allowed
  if (isAuthenticated && !hasRequiredRole) {
    navigate('/');
    return null;
  }

  return <Outlet />;
};
