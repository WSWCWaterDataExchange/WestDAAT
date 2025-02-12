import { useQuery } from 'react-query';
import { getFundingOrganizationDetails } from '../../../../accessors/applicationAccessor';

export function useFundingOrganization(waterRightNativeId: string | undefined) {
  return useQuery(
    ['fundingOrganizationDetails', waterRightNativeId],
    () => getFundingOrganizationDetails(waterRightNativeId!),
    {
      enabled: !!waterRightNativeId,
    },
  );
}
