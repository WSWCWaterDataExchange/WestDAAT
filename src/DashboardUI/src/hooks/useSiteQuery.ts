import { useQuery } from 'react-query';
import {
  getSiteDetails,
  getWaterRightsDigests,
  getWaterSiteLocation,
  getWaterSiteSourceInfoList,
  getWaterRightInfoList,
  getSiteDigest
} from '../accessors/siteAccessor';

export function useWaterRightsDigests(siteUuid: string) {
  return useQuery(
    ['site.waterRightsDigests', siteUuid],
    async () => await getWaterRightsDigests(siteUuid),
    {
      enabled: !!siteUuid
    }
  );
}

export function useSiteDigest(siteUuid: string) {
  return useQuery(
    ['site.siteDigest', siteUuid],
    async () => await getSiteDigest(siteUuid),
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

export function useWaterRightInfoList(siteUuid: string) {
  return useQuery(
    ['site.WaterRightInfoList', siteUuid],
    async () => await getWaterRightInfoList(siteUuid),
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