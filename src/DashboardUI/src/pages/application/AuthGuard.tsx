import { Outlet, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppProvider';

export const AuthGuard = () => {
  const {
    authenticationContext: { authenticationComplete, isAuthenticated },
  } = useAppContext();
  const navigate = useNavigate();

  if (authenticationComplete && !isAuthenticated) {
    navigate('/');
  }

  return <Outlet />;
};
