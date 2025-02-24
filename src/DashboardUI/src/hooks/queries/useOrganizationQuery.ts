import { useQuery } from 'react-query';
import { getOrganizationSummaryList } from '../../accessors/organizationAccessor';
import { useMsal } from '@azure/msal-react';
import { searchUsers } from '../../accessors/userAccessor';

export function useOrganizationQuery() {
  const msalContext = useMsal();
  return useQuery('organizationSummaryList', async () => await getOrganizationSummaryList(msalContext));
}

export function useUserSearchQuery(searchTerm: string) {
  const msalContext = useMsal();
  return useQuery(['searchUsers', searchTerm], async () => await searchUsers(msalContext, searchTerm));
}