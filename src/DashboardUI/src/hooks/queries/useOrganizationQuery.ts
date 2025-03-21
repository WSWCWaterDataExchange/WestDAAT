import { useMsal } from '@azure/msal-react';
import { useQuery } from 'react-query';
import { getOrganizationSummaryList } from '../../accessors/organizationAccessor';
import { getOrganizationUsers, searchUsers } from '../../accessors/userAccessor';

export function useOrganizationQuery() {
  const msalContext = useMsal();
  console.log(`useOrganizationQuery: ${JSON.stringify(msalContext.accounts)}`);
  return useQuery('organizationSummaryList', async () => await getOrganizationSummaryList(msalContext));
}

export function useUserSearchQuery(searchTerm: string) {
  const msalContext = useMsal();
  return useQuery(['searchUsers', searchTerm], async () => await searchUsers(msalContext, searchTerm));
}

export function useOrganizationUsersQuery(organizationId?: string) {
  const msalContext = useMsal();
  return useQuery({
    queryKey: ['organizationUsers', organizationId],
    queryFn: async () => await getOrganizationUsers(msalContext, organizationId!),
    enabled: !!organizationId
  });
}