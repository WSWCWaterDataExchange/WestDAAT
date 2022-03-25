import { useQuery } from 'react-query';
import { getWaterRightsDigests } from '../accessors/siteAccessor';

export function useWaterRightsDigests(siteUuid: string) {
  return useQuery(
    ['siteWaterRightsDigests', siteUuid],
    async () => await getWaterRightsDigests(siteUuid),
    {
      enabled: !!siteUuid,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      cacheTime: 8600000,
      staleTime: Infinity
    }
  );
}
