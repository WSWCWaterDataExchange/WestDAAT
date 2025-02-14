import { useQuery } from 'react-query';
import { getFundingOrganizationDetails } from '../../../../accessors/applicationAccessor';
import { useMsal } from '@azure/msal-react';
import { useConservationApplicationContext } from '../../../../contexts/ConservationApplicationProvider';
import { FundingOrganizationDetails } from '../../../../data-contracts/FundingOrganizationDetails';

export function useFundingOrganization(waterRightNativeId: string | undefined) {
  const context = useMsal();
  const { dispatch } = useConservationApplicationContext();

  return useQuery(
    ['fundingOrganizationDetails', waterRightNativeId],
    () => getFundingOrganizationDetails(context, waterRightNativeId!),
    {
      enabled: !!waterRightNativeId,
      onSuccess: (result: FundingOrganizationDetails) => {
        if (result) {
          dispatch({
            type: 'FUNDING_ORGANIZATION_LOADED',
            payload: {
              fundingOrganizationId: result.fundingOrganizationId,
              fundingOrganizationName: result.fundingOrganizationName,
              openEtModelName: result.openEtModelName,
              dateRangeStart: result.dateRangeStart,
              dateRangeEnd: result.dateRangeEnd,
              compensationRateModel: result.compensationRateModel,
            },
          });
        }
      },
    },
  );
}
