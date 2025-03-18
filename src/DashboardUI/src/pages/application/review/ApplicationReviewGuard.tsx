import { Outlet, useNavigate } from 'react-router-dom';
import { Role } from '../../../config/role';
import { hasOrganizationRole, hasUserRole } from '../../../utilities/securityHelpers';
import { useAppContext } from '../../../contexts/AppProvider';

export const ApplicationReviewGuard = () => {
  const {
    authenticationContext: { isAuthenticated, user },
  } = useAppContext();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  const authorizedRoles: Role[] = [Role.GlobalAdmin, Role.OrganizationAdmin, Role.TechnicalReviewer, Role.Member];

  const hasRequiredRole = authorizedRoles.some((role): boolean => {
    return hasUserRole(user, role) || hasOrganizationRole(user, role);
  });

  if (!hasRequiredRole) {
    navigate('/');
    return null;
  }

  return <Outlet />;
};
