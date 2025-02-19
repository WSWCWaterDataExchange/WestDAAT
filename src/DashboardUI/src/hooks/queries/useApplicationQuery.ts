import { useMsal } from '@azure/msal-react';
import { useConservationApplicationContext } from '../../contexts/ConservationApplicationProvider';
import { useQuery } from 'react-query';
import {
  applicationSearch,
  createWaterConservationApplication,
  getFundingOrganizationDetails,
} from '../../accessors/applicationAccessor';
import { WaterConservationApplicationCreateResponse } from '../../data-contracts/WaterConservationApplicationCreateResponse';
import { FundingOrganizationDetails } from '../../data-contracts/FundingOrganizationDetails';

export function useLoadDashboardApplications(organizationIdFilter: string | null) {
  const context = useMsal();
  const { dispatch } = useConservationApplicationContext();

  return useQuery(['organization-dashboard-load', organizationIdFilter], {
    queryFn: () => applicationSearch(context, organizationIdFilter),
    onSuccess(data) {
      dispatch({ type: 'DASHBOARD_APPLICATIONS_LOADED', payload: { dashboardApplications: data.applications } });
    },
  });
}

export function useCreateWaterConservationApplicationQuery(fields: {
  waterRightNativeId: string | undefined;
  fundingOrganizationId: string | undefined;
}) {
  const context = useMsal();
  const { dispatch } = useConservationApplicationContext();
  return useQuery(
    ['createWaterConservationApplication', fields.waterRightNativeId, fields.fundingOrganizationId],
    () =>
      createWaterConservationApplication(context, {
        waterRightNativeId: fields.waterRightNativeId!,
        fundingOrganizationId: fields.fundingOrganizationId!,
      }),
    {
      enabled: !!fields.waterRightNativeId && !!fields.fundingOrganizationId,
      onSuccess: (result: WaterConservationApplicationCreateResponse) => {
        if (result) {
          dispatch({
            type: 'APPLICATION_CREATED',
            payload: {
              waterConservationApplicationId: result.waterConservationApplicationId,
            },
          });
        }
      },
    },
  );
}

export function useFundingOrganizationQuery(waterRightNativeId: string | undefined) {
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
