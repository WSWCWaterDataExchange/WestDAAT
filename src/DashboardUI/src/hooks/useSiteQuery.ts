import { useQuery } from 'react-query';
import { getWaterRightsDigests } from '../accessors/siteAccessor';

export function useWaterRightsDigests(siteUuid: string) {
  return useQuery(
    ['site.waterRightsDigests', siteUuid],
    async () => await getWaterRightsDigests(siteUuid),
    {
      enabled: !!siteUuid
    }
  );
}
