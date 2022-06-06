import { useQuery } from 'react-query';
import { getSiteDetails, getWaterRightsDigests, getWaterSiteLocation } from '../accessors/siteAccessor';

export function useWaterRightsDigests(siteUuid: string) {
  return useQuery(
    ['site.waterRightsDigests', siteUuid],
    async () => await getWaterRightsDigests(siteUuid),
    {
      enabled: !!siteUuid
    }
  );
}

export function useWaterSiteLocation(siteUuid: string) {
  return useQuery(
    ['site.SiteLocation', siteUuid],
    async () => await getWaterSiteLocation(siteUuid),
    {
      enabled: !!siteUuid,
    }
  );
}

export function useSiteDetails(siteUuid: string) {
  return useQuery(
    ['site', siteUuid],
    async () => await getSiteDetails(siteUuid),
    {
      enabled: !!siteUuid,
    }
  );
}