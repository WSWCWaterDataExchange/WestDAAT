import { useMsal } from '@azure/msal-react';
import { useQuery } from 'react-query';
import { applicationSearch } from '../../accessors/applicationAccessor';
import { getOrganizationSummaryList } from '../../accessors/organizationAccessor';
import { searchUsers } from '../../accessors/userAccessor';
import { useConservationApplicationContext } from '../../contexts/ConservationApplicationProvider';

export function useOrganizationQuery() {
  const msalContext = useMsal();
  return useQuery('organizationSummaryList', async () => await getOrganizationSummaryList(msalContext));
}

export function useUserSearchQuery(searchTerm: string) {
  const msalContext = useMsal();
  return useQuery(['searchUsers', searchTerm], async () => await searchUsers(msalContext, searchTerm));
}

export function useOrganizationDashboardLoadQuery(organizationIdFilter: string | null) {
  const msalContext = useMsal();
  const { dispatch } = useConservationApplicationContext();

  return useQuery(
    ['organization-dashboard-load', organizationIdFilter],
    {
      queryFn: () => applicationSearch(msalContext, organizationIdFilter),
      onSuccess(data) {
        dispatch({ type: 'DASHBOARD_APPLICATIONS_LOADED', payload: { dashboardApplications: data.applications } });
      },
    },
  );
}