import { useQuery } from 'react-query';
import { createWaterConservationApplication } from '../../../../accessors/applicationAccessor';

export function UseCreateWaterConservationApplication(fields: {
  waterRightNativeId: string | undefined;
  fundingOrganizationId: string | undefined;
}) {
  return useQuery(
    ['createWaterConservationApplication', fields.waterRightNativeId, fields.fundingOrganizationId],
    () =>
      createWaterConservationApplication({
        waterRightNativeId: fields.waterRightNativeId!,
        fundingOrganizationId: fields.fundingOrganizationId!,
      }),
    {
      enabled: !!fields.waterRightNativeId && !!fields.fundingOrganizationId,
    },
  );
}
