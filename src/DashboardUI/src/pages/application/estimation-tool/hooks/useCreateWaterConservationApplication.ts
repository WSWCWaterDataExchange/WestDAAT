import { useQuery } from 'react-query';
import { createWaterConservationApplication } from '../../../../accessors/applicationAccessor';
import { IMsalContext } from '@azure/msal-react';

export function useCreateWaterConservationApplication(
  context: IMsalContext,
  fields: {
    waterRightNativeId: string | undefined;
    fundingOrganizationId: string | undefined;
  },
) {
  return useQuery(
    ['createWaterConservationApplication', fields.waterRightNativeId, fields.fundingOrganizationId],
    () =>
      createWaterConservationApplication(context, {
        waterRightNativeId: fields.waterRightNativeId!,
        fundingOrganizationId: fields.fundingOrganizationId!,
      }),
    {
      enabled: !!fields.waterRightNativeId && !!fields.fundingOrganizationId,
    },
  );
}
