import { useMsal } from '@azure/msal-react';
import { useQuery } from 'react-query';
import { useAuthenticationContext } from '../useAuthenticationContext';
import { getUserProfile } from '../../accessors/userAccessor';

export function useUserProfile(userId?: string) {
  const context = useMsal();
  const { user } = useAuthenticationContext();

  // If no user is specified, use the current user
  if (!userId) {
    userId = user?.userId;
  }

  return useQuery(['user-profile', userId], {
    queryFn: () => getUserProfile(context, userId!),
    enabled: !!userId,
  });
}
