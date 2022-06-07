import { useQuery } from 'react-query';
import { getWaterRightsDigests, getWaterSiteLocation, getWaterSiteSourceInfoList } from '../accessors/siteAccessor';

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

export function useWaterSiteSourceInfoList(siteUuid: string) {
  return useQuery(
    ['site.SourceInfoList', siteUuid],
    async () => await getWaterSiteSourceInfoList(siteUuid),
    {
      enabled: !!siteUuid,
    }
  );
}