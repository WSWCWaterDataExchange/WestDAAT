import { useQuery } from 'react-query';
import {
  getSiteDetails,
  getWaterRightsDigests,
  getWaterSiteLocation,
  getWaterSiteSourceInfoList,
  getWaterRightInfoList,
  getSiteDigest,
  getSiteUsage,
  getSiteVariableInfoList,
  getSiteMethodInfoList,
  getOverlayDigests,
  getTimeSeriesInfoList,
} from '../../accessors/siteAccessor';
import { UseQueryOptionsParameter } from '../../HelperTypes';
import { WaterRightInfoListItem } from '../../data-contracts/WaterRightInfoListItem';
import { WaterSourceInfoListItem } from '../../data-contracts/WaterSourceInfoListItem';
import { VariableInfoListItem } from '../../data-contracts/VariableInfoListItem';
import { MethodInfoListItem } from '../../data-contracts/MethodInfoListItem';
import { TimeSeriesListItem } from '../../data-contracts/TimeSeriesListItem';

export function useWaterRightsDigests(siteUuid: string) {
  return useQuery(['site.waterRightsDigests', siteUuid], async () => await getWaterRightsDigests(siteUuid), {
    enabled: !!siteUuid,
  });
}

export function useSiteDigest(siteUuid: string) {
  return useQuery(['site.siteDigest', siteUuid], async () => await getSiteDigest(siteUuid), {
    enabled: !!siteUuid,
  });
}

export function useOverlayDigests(overlayUuid: string | undefined) {
  return useQuery(['overlay.Digests', overlayUuid], async () => await getOverlayDigests(overlayUuid!), {
    enabled: !!overlayUuid,
  });
}

export function useWaterSiteLocation(siteUuid: string | undefined) {
  return useQuery(['site.SiteLocation', siteUuid], async () => await getWaterSiteLocation(siteUuid!), {
    enabled: !!siteUuid,
  });
}

type WaterSiteSourceInfoListOptionsType = UseQueryOptionsParameter<undefined, WaterSourceInfoListItem[]>;

export function useWaterSiteSourceInfoList(siteUuid: string | undefined, options?: WaterSiteSourceInfoListOptionsType) {
  const setOptions = {
    ...options,
    enabled: options?.enabled && !!siteUuid,
  };
  return useQuery(
    ['site.SourceInfoList', siteUuid],
    async () => await getWaterSiteSourceInfoList(siteUuid!),
    setOptions,
  );
}

type WaterRightInfoListOptionsType = UseQueryOptionsParameter<undefined, WaterRightInfoListItem[]>;

export function useWaterRightInfoList(siteUuid: string | undefined, options?: WaterRightInfoListOptionsType) {
  const setOptions = {
    ...options,
    enabled: options?.enabled && !!siteUuid,
  };
  return useQuery(
    ['site.WaterRightInfoList', siteUuid],
    async () => await getWaterRightInfoList(siteUuid!),
    setOptions,
  );
}

type TimeSeriesInfoListOptionsType = UseQueryOptionsParameter<undefined, TimeSeriesListItem[]>;

export function useTimeSeriesInfoList(siteUuid: string | undefined, options?: TimeSeriesInfoListOptionsType) {
  const setOptions = {
    ...options,
    enabled: options?.enabled && !!siteUuid,
  };
  return useQuery(
    ['site.TimeSeriesInfoList', siteUuid],
    async () => await getTimeSeriesInfoList(siteUuid!),
    setOptions,
  );
}

export function useSiteDetails(siteUuid: string | undefined) {
  return useQuery(['site', siteUuid], async () => await getSiteDetails(siteUuid!), {
    enabled: !!siteUuid,
  });
}

export function useSiteUsage(siteUuid: string | undefined) {
  return useQuery(['site.UsagePointList', siteUuid], async () => await getSiteUsage(siteUuid!), {
    enabled: !!siteUuid,
  });
}

type VariableInfoListOptionsType = UseQueryOptionsParameter<undefined, VariableInfoListItem[]>;

export function useSiteVariableInfoList(siteUuid: string | undefined, options?: VariableInfoListOptionsType) {
  const setOptions = {
    ...options,
    enabled: options?.enabled && !!siteUuid,
  };
  return useQuery(
    ['site.VariableInfoList', siteUuid],
    async () => await getSiteVariableInfoList(siteUuid!),
    setOptions,
  );
}

type MethodInfoListOptionsType = UseQueryOptionsParameter<undefined, MethodInfoListItem[]>;

export function useSiteMethodInfoList(siteUuid: string | undefined, options?: MethodInfoListOptionsType) {
  const setOptions = {
    ...options,
    enabled: options?.enabled && !!siteUuid,
  };
  return useQuery(['site.VariableInfoList', siteUuid], async () => await getSiteMethodInfoList(siteUuid!), setOptions);
}
