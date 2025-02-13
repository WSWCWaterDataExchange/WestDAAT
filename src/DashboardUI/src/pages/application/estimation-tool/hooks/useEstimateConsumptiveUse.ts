import { useQuery } from 'react-query';
import { estimateConsumptiveUse } from '../../../../accessors/applicationAccessor';
import { Feature, GeoJsonProperties, Geometry } from 'geojson';
import { CompensationRateUnits } from '../../../../data-contracts/CompensationRateUnits';
import { IMsalContext } from '@azure/msal-react';

export function useEstimateConsumptiveUse(
  context: IMsalContext,
  fields: {
    waterConservationApplicationId: string | undefined;
    waterRightNativeId: string | undefined;
    model: number | undefined;
    dateRangeStart: Date | undefined;
    dateRangeEnd: Date | undefined;
    polygons: Feature<Geometry, GeoJsonProperties>[] | undefined;
    compensationRateDollars: number | undefined;
    units: Exclude<CompensationRateUnits, CompensationRateUnits.None> | undefined;
  },
) {
  return useQuery(
    [
      'estimateConsumptiveUse',
      fields.waterConservationApplicationId,
      fields.waterRightNativeId,
      fields.model,
      fields.dateRangeStart,
      fields.dateRangeEnd,
      fields.polygons,
      ...(fields.polygons ?? []),
      fields.compensationRateDollars,
      fields.units,
    ],
    async () =>
      estimateConsumptiveUse(context, {
        waterConservationApplicationId: fields.waterConservationApplicationId!,
        waterRightNativeId: fields.waterRightNativeId!,
        model: fields.model!,
        dateRangeStart: fields.dateRangeStart!,
        dateRangeEnd: fields.dateRangeEnd!,
        polygons: fields.polygons!,
        compensationRateDollars: fields.compensationRateDollars,
        units: fields.units,
      }),
    {
      enabled:
        !!fields.waterConservationApplicationId &&
        !!fields.waterRightNativeId &&
        !!fields.model &&
        !!fields.dateRangeStart &&
        !!fields.dateRangeEnd &&
        !!fields.polygons &&
        fields.polygons.length > 0,
      // compensation rate is optional
    },
  );
}
