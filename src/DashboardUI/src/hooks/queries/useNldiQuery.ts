import { useQuery } from 'react-query';
import { getNldiFeatures } from '../../accessors/nldiAccessor';
import { DataPoints, Directions } from '../../data-contracts/nldi';

export function useNldiFeatures(latitude: number | null, longitude: number | null) {
  return useQuery(
    ['nldi.features', latitude, longitude],
    () => getNldiFeatures(latitude ?? 0, longitude ?? 0, Directions.Upsteam | Directions.Downsteam, DataPoints.Usgs | DataPoints.Epa | DataPoints.Wade),
    {
      enabled: !!latitude && !!longitude
    }
  );
}
