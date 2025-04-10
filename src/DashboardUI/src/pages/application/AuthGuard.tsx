import { useMsal } from '@azure/msal-react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppProvider';
import { loginRequest } from '../../authConfig';
import { useEffect } from 'react';

export const AuthGuard = () => {
  const {
    authenticationContext: { authenticationComplete, isAuthenticated },
  } = useAppContext();
  const navigate = useNavigate();
  const { instance, accounts } = useMsal();

  useEffect(() => {
    if (authenticationComplete) {
      if (!isAuthenticated) {
        // If not authenticated, redirect to login
        instance.loginRedirect(loginRequest).catch((error) => {
          console.error('Login redirect failed:', error);
          navigate('/');
        });
      }
    }
  }, [authenticationComplete, isAuthenticated, instance, navigate]);

  // Don't render anything until the authentication check is finished above
  if (!authenticationComplete || !isAuthenticated || accounts.length === 0) {
    return null;
  }

  return <Outlet />;
};
