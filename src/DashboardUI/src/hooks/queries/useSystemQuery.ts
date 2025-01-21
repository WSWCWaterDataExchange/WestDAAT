import { useQuery } from 'react-query';
import { getFilters, getRiverBasinPolygonsByName } from '../../accessors/systemAccessor';
import { useMsal } from '@azure/msal-react';

export function useDashboardFilters() {
  const msalContext = useMsal();
  return useQuery(['system.filters'], async () => await getFilters(msalContext));
}

export function useRiverBasinPolygons(riverBasinNames: string[]) {
  return useQuery(
    ['system.riverBasinPolygonsByName', ...[...riverBasinNames].sort()],
    () => getRiverBasinPolygonsByName(riverBasinNames),
    { enabled: riverBasinNames.length > 0 },
  );
}
