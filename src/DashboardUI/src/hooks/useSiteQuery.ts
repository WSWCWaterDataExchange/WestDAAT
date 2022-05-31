import { useQuery } from 'react-query';
import { getWaterRightsDigests, getWaterSiteDetails } from '../accessors/siteAccessor';

export function useWaterRightsDigests(siteUuid: string) {
  return useQuery(
    ['site.waterRightsDigests', siteUuid],
    async () => await getWaterRightsDigests(siteUuid),
    {
      enabled: !!siteUuid
    }
  );
}
export function useWaterSiteDetails(siteUuid: string) {
  return useQuery(
    ['site.waterSiteDetails', siteUuid],
    async () => await getWaterSiteDetails(siteUuid),
    {
      enabled: !!siteUuid
    }
  );
}
