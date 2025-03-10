import { useQuery } from 'react-query';
import {
  getWaterRightDetails,
  getWaterRightSiteInfoList,
  getWaterRightSourceInfoList,
  getWaterRightSiteLocations,
  findWaterRight,
  getWaterRightAnalyticsSummaryInfo,
  downloadWaterRights,
  getWaterRightDataEnvelope, getWaterRightOverlayInfoList,
} from '../../accessors/waterAllocationAccessor';
import {
  WaterRightsSearchCriteria,
  WaterRightsSearchCriteriaWithFilterUrl,
  WaterRightsSearchCriteriaWithGrouping,
  WaterRightsSearchCriteriaWithPaging,
} from '../../data-contracts/WaterRightsSearchCriteria';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { UseQueryOptionsParameter } from '../../HelperTypes';
import { SiteInfoListItem, OverlayInfoListItem, WaterSourceInfoListItem } from '@data-contracts';

export function useWaterRightDetails(allocationUuid: string | undefined) {
  return useQuery(['waterRight.Details', allocationUuid], async () => await getWaterRightDetails(allocationUuid!), {
    enabled: !!allocationUuid,
  });
}

export function useGetAnalyticsSummaryInfo(searchCriteria: WaterRightsSearchCriteriaWithGrouping | null) {
  return useQuery(
    ['waterRight.AnalyticsSummary', searchCriteria],
    async () => await getWaterRightAnalyticsSummaryInfo(searchCriteria!),
    {
      enabled: searchCriteria !== null,
    },
  );
}

type WaterRightDataEnvelopeOptionsType = UseQueryOptionsParameter<
  WaterRightsSearchCriteria | null,
  FeatureCollection<Geometry, GeoJsonProperties>
>;

export function useGetWaterRightDataEnvelope(
  searchCriteria: WaterRightsSearchCriteria | null,
  options?: WaterRightDataEnvelopeOptionsType,
) {
  const setOptions = {
    ...options,
    enabled: options?.enabled && searchCriteria !== null,
  };
  return useQuery(
    ['waterRight.DataEnvelope', searchCriteria],
    async () => await getWaterRightDataEnvelope(searchCriteria!),
    setOptions,
  );
}

export function useFindWaterRights(searchCriteria: WaterRightsSearchCriteriaWithPaging | null) {
  return useQuery(['waterRight.Find', searchCriteria], async () => await findWaterRight(searchCriteria!), {
    enabled: searchCriteria !== null,
  });
}

type WaterRightSiteInfoListOptionsType = UseQueryOptionsParameter<undefined, SiteInfoListItem[]>;

export function useWaterRightSiteInfoList(
  waterRightId: string | undefined,
  options?: WaterRightSiteInfoListOptionsType,
) {
  const setOptions = {
    ...options,
    enabled: options?.enabled && !!waterRightId,
  };
  return useQuery(
    ['waterRight.SiteInfoList', waterRightId],
    async () => await getWaterRightSiteInfoList(waterRightId!),
    setOptions,
  );
}

type WaterRightSourceInfoListOptionsType = UseQueryOptionsParameter<undefined, WaterSourceInfoListItem[]>;

export function useWaterRightSourceInfoList(
  allocationUuid: string | undefined,
  options?: WaterRightSourceInfoListOptionsType,
) {
  const setOptions = {
    ...options,
    enabled: options?.enabled && !!allocationUuid,
  };
  return useQuery(
    ['waterRight.SourceInfoList', allocationUuid],
    async () => await getWaterRightSourceInfoList(allocationUuid!),
    setOptions,
  );
}

export function useWaterRightSiteLocations(allocationUuid: string | undefined) {
  return useQuery(
    ['waterRight.SiteLocations', allocationUuid],
    async () => await getWaterRightSiteLocations(allocationUuid!),
    {
      enabled: !!allocationUuid,
    },
  );
}

export function useWaterRightsDownload(searchCriteria: WaterRightsSearchCriteriaWithFilterUrl | null) {
  return useQuery(['waterRight.Download', searchCriteria], async () => await downloadWaterRights(searchCriteria!), {
    enabled: !!searchCriteria,
    retry: false,
    cacheTime: 0,
  });
}

export function useWaterRightOverlyInfoList(
  allocationUuid: string | undefined,
  options?: UseQueryOptionsParameter<undefined, OverlayInfoListItem[]>,
) {
  const setOptions = {
    ...options,
    enabled: options?.enabled && !!allocationUuid,
  };

  return useQuery(
    ['waterRight.OverlayInfoList', allocationUuid],
    async () => await getWaterRightOverlayInfoList(allocationUuid!),
    setOptions,
  );
}
