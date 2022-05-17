import { useQuery } from 'react-query';
import { getNldiFeatures } from '../accessors/nldiAccessor';
import { DataPoints, Directions } from '../data-contracts/nldi';

export function useNldiFeatures(latitude: number | null, longitude: number | null, isEnabled: boolean) {
  return useQuery(
    ['nldi.features', latitude, longitude],
    () => isEnabled ? getNldiFeatures(latitude ?? 0, longitude ?? 0, Directions.Upsteam | Directions.Downsteam, DataPoints.Usgs | DataPoints.Epa | DataPoints.Wade) : null,
    {
      enabled: !!latitude && !!longitude
    }
  );
}
