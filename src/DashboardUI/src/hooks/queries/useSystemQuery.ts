import { useQuery } from 'react-query';
import { getFilters, getRiverBasinPolygonsByName } from '../../accessors/systemAccessor';

export function useDashboardFilters() {
  return useQuery(['system.filters'], getFilters);
}

export function useRiverBasinPolygons(riverBasinNames: string[]) {
  return useQuery(
    ['system.riverBasinPolygonsByName', ...[...riverBasinNames].sort()],
    () => getRiverBasinPolygonsByName(riverBasinNames),
    { enabled: riverBasinNames.length > 0 },
  );
}
