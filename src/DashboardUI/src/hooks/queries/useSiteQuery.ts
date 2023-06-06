import { useQuery } from 'react-query';
import {
  getSiteDetails,
  getWaterRightsDigests,
  getWaterSiteLocation,
  getWaterSiteSourceInfoList,
  getWaterRightInfoList,
  getSiteDigest
} from '../../accessors/siteAccessor';
import { UseQueryOptionsParameter } from '../../HelperTypes';
import { WaterRightInfoListItem } from '../../data-contracts/WaterRightInfoListItem';
import { WaterSourceInfoListItem } from '../../data-contracts/WaterSourceInfoListItem';

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

export function useWaterSiteLocation(siteUuid: string | undefined) {
  return useQuery(
    ['site.SiteLocation', siteUuid],
    async () => await getWaterSiteLocation(siteUuid!),
    {
      enabled: !!siteUuid,
    }
  );
}

type WaterSiteSourceInfoListOptionsType = UseQueryOptionsParameter<undefined, WaterSourceInfoListItem[]>
export function useWaterSiteSourceInfoList(siteUuid: string | undefined, options?: WaterSiteSourceInfoListOptionsType) {
  const setOptions = {
    ...options,
    enabled: options?.enabled && !!siteUuid
  }
  return useQuery(
    ['site.SourceInfoList', siteUuid],
    async () => await getWaterSiteSourceInfoList(siteUuid!),
    setOptions
  );
}

type WaterRightInfoListOptionsType = UseQueryOptionsParameter<undefined, WaterRightInfoListItem[]>
export function useWaterRightInfoList(siteUuid: string | undefined, options?: WaterRightInfoListOptionsType) {
  const setOptions = {
    ...options,
    enabled: options?.enabled && !!siteUuid
  }
  return useQuery(
    ['site.WaterRightInfoList', siteUuid],
    async () => await getWaterRightInfoList(siteUuid!),
    setOptions
  );
}

export function useSiteDetails(siteUuid: string | undefined) {
  return useQuery(
    ['site', siteUuid],
    async () => await getSiteDetails(siteUuid!),
    {
      enabled: !!siteUuid,
    }
  );
}