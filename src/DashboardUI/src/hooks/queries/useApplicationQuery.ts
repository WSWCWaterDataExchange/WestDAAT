import { useMsal } from '@azure/msal-react';
import { useConservationApplicationContext } from '../../contexts/ConservationApplicationProvider';
import { useQuery } from 'react-query';
import {
  applicationSearch,
  createWaterConservationApplication,
  getApplication,
} from '../../accessors/applicationAccessor';
import { WaterConservationApplicationCreateResponse } from '../../data-contracts/WaterConservationApplicationCreateResponse';
import { toast } from 'react-toastify';
import { getOrganizationFundingDetails } from '../../accessors/organizationAccessor';
import { OrganizationFundingDetailsResponse } from '../../data-contracts/OrganizationFundingDetailsResponse';
import { parseDateOnly } from '../../utilities/dateHelpers';
import { ApplicationReviewPerspective } from '../../data-contracts/ApplicationReviewPerspective';

export function useLoadDashboardApplications(organizationIdFilter: string | null, isEnabled: boolean) {
  const context = useMsal();
  const { dispatch } = useConservationApplicationContext();

  return useQuery(['organization-dashboard-load', organizationIdFilter], {
    queryFn: () => applicationSearch(context, organizationIdFilter),
    enabled: isEnabled,
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
              waterConservationApplicationDisplayId: result.waterConservationApplicationDisplayId,
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
    async () => {
      dispatch({ type: 'FUNDING_ORGANIZATION_LOADING' });
      return await getOrganizationFundingDetails(context, waterRightNativeId!);
    },
    {
      enabled: !!waterRightNativeId,
      onSuccess: (result: OrganizationFundingDetailsResponse) => {
        const org = result.organization;

        dispatch({
          type: 'FUNDING_ORGANIZATION_LOADED',
          payload: {
            fundingOrganizationId: org.organizationId,
            fundingOrganizationName: org.organizationName,
            openEtModelName: org.openEtModelDisplayName,
            dateRangeStart: parseDateOnly(org.openEtDateRangeStart),
            dateRangeEnd: parseDateOnly(org.openEtDateRangeEnd),
            compensationRateModel: org.compensationRateModel,
          },
        });
      },
      onError: (error: Error) => {
        toast.error('Failed to load data. Please try again later.');
      },
    },
  );
}

export function useGetApplicationQuery(
  applicationId: string | undefined,
  perspective: ApplicationReviewPerspective,
  isQueryEnabled: boolean,
) {
  const context = useMsal();
  const { dispatch } = useConservationApplicationContext();

  return useQuery(
    ['getApplication', applicationId, perspective],
    async () => {
      dispatch({ type: 'APPLICATION_LOADING' });

      return await getApplication(context, {
        applicationId: applicationId!,
        perspective,
      });
    },
    {
      enabled: !!applicationId && isQueryEnabled,
      // do not cache data. results should always be fresh in case another user updates the application
      cacheTime: 0,
      onSuccess: (result) => {
        dispatch({
          type: 'APPLICATION_LOADED',
          payload: {
            application: result.application,
            notes: result.notes ?? [],
          },
        });
      },
      onError: (error: Error) => {
        toast.error('Failed to load Application data. Please try again later.');
        dispatch({ type: 'APPLICATION_LOAD_ERRORED' });
      },
    },
  );
}
