import { useQuery } from 'react-query';
import { getFundingOrganizationDetails } from '../../../../accessors/applicationAccessor';
import { IMsalContext } from '@azure/msal-react';

export function useFundingOrganization(context: IMsalContext, waterRightNativeId: string | undefined) {
  return useQuery(
    ['fundingOrganizationDetails', waterRightNativeId],
    () => getFundingOrganizationDetails(context, waterRightNativeId!),
    {
      enabled: !!waterRightNativeId,
    },
  );
}
