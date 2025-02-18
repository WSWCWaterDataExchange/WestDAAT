import { useQuery } from 'react-query';
import { createWaterConservationApplication } from '../../../../accessors/applicationAccessor';
import { useMsal } from '@azure/msal-react';
import { WaterConservationApplicationCreateResponse } from '../../../../data-contracts/WaterConservationApplicationCreateResponse';
import { useConservationApplicationContext } from '../../../../contexts/ConservationApplicationProvider';

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
