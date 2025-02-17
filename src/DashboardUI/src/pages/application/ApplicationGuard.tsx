import { Outlet, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppProvider';

export const ApplicationGuard = () => {
  const {
    authenticationContext: { authenticationComplete, isAuthenticated, user },
  } = useAppContext();
  const navigate = useNavigate();

  if (authenticationComplete && !isAuthenticated) {
    navigate('/');
  }

  return <Outlet />;
};
