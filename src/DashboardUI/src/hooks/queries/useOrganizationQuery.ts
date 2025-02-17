import { useQuery } from 'react-query';
import { getOrganizationSummaryList } from '../../accessors/organizationAccessor';
import { useMsal } from '@azure/msal-react';

export function useOrganizationQuery() {
  const msalContext = useMsal();
  return useQuery('organizationSummaryList', async () => await getOrganizationSummaryList(msalContext));
}
