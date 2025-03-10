import { useQuery } from 'react-query';
import { getNldiFeatures } from '../../accessors/nldiAccessor';
import { DataPoints, Directions } from '../../data-contracts/nldi';

export function useNldiFeatures(latitude: number | null, longitude: number | null) {
  return useQuery(
    ['nldi.features', latitude, longitude],
    () =>
      getNldiFeatures(
        latitude ?? 0,
        longitude ?? 0,
        Directions.Upstream | Directions.Downstream,
        DataPoints.Usgs | DataPoints.Epa | DataPoints.WadeRights | DataPoints.WadeTimeseries,
      ),
    {
      enabled: !!latitude && !!longitude,
    },
  );
}
