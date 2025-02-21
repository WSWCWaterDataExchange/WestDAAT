import { useMsal } from '@azure/msal-react';
import { useConservationApplicationContext } from '../../contexts/ConservationApplicationProvider';
import { useQuery } from 'react-query';
import { applicationSearch, createWaterConservationApplication } from '../../accessors/applicationAccessor';
import { WaterConservationApplicationCreateResponse } from '../../data-contracts/WaterConservationApplicationCreateResponse';
import { toast } from 'react-toastify';
import { getOrganizationFundingDetails } from '../../accessors/organizationAccessor';
import { OrganizationFundingDetailsResponse } from '../../data-contracts/OrganizationFundingDetailsResponse';

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
      onError: (error: Error) => {
        toast.error('Failed to load data. Please try again later.');
      },
    },
  );
}

export function useFundingOrganizationQuery(waterRightNativeId: string | undefined) {
  const context = useMsal();
  const { dispatch } = useConservationApplicationContext();

  return useQuery(
    ['fundingOrganizationDetails', waterRightNativeId],
    () => getOrganizationFundingDetails(context, waterRightNativeId!),
    {
      enabled: !!waterRightNativeId,
      onSuccess: (result: OrganizationFundingDetailsResponse) => {
        if (result && result.organization) {
          const org = result.organization;

          dispatch({
            type: 'FUNDING_ORGANIZATION_LOADED',
            payload: {
              fundingOrganizationId: org.organizationId,
              fundingOrganizationName: org.organizationName,
              openEtModelName: org.openEtModelDisplayName,
              dateRangeStart: new Date(org.openEtDateRangeStart),
              dateRangeEnd: new Date(org.openEtDateRangeEnd),
              compensationRateModel: org.compensationRateModel,
            },
          });
        }
      },
      onError: (error: Error) => {
        toast.error('Failed to load data. Please try again later.');
      },
    },
  );
}
