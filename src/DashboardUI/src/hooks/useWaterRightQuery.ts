import { useQuery } from 'react-query';
import {
  getWaterRightDetails,
  getWaterRightSiteInfoList,
  getWaterRightSourceInfoList,
  getWaterRightSiteLocations,
  findWaterRight,
  getWaterRightAnalyticsSummaryInfo,
  downloadWaterRights
} from '../accessors/waterAllocationAccessor';
import { WaterRightsSearchCriteria } from '../data-contracts/WaterRightsSearchCriteria';

export function useWaterRightDetails(allocationUuid: string) {
  return useQuery(
    ['waterRight.Details', allocationUuid],
    async () => await getWaterRightDetails(allocationUuid),
    {
      enabled: !!allocationUuid,
    }
  );
}

export function useGetAnalyticsSummaryInfo(searchCriteria: WaterRightsSearchCriteria | null) {
  return useQuery(
    ['waterRight.AnalyticsSummary', searchCriteria],
    async () => await getWaterRightAnalyticsSummaryInfo(searchCriteria!),
    {
      enabled: searchCriteria !== null
    }
  );
}

export function useFindWaterRights(searchCriteria: WaterRightsSearchCriteria | null) {
  return useQuery(
    ['waterRight.Find', searchCriteria],
    async () => await findWaterRight(searchCriteria!),
    {
      enabled: searchCriteria !== null
    }
  );
}

export function useWaterRightSiteInfoList(waterRightId: string) {
  return useQuery(
    ['waterRight.SiteInfoList', waterRightId],
    async () => await getWaterRightSiteInfoList(waterRightId),
    {
      enabled: !!waterRightId,
    }
  );
}

export function useWaterRightSourceInfoList(allocationUuid: string) {
  return useQuery(
    ['waterRight.SourceInfoList', allocationUuid],
    async () => await getWaterRightSourceInfoList(allocationUuid),
    {
      enabled: !!allocationUuid,
    }
  );
}

export function useWaterRightSiteLocations(allocationUuid: string) {
  return useQuery(
    ['waterRight.SiteLocations', allocationUuid],
    async () => await getWaterRightSiteLocations(allocationUuid),
    {
      enabled: !!allocationUuid,
    }
  );
}

export function useWaterRightsDownload(searchCriteria: WaterRightsSearchCriteria | null) {
  return useQuery(
    ['waterRight.Download', searchCriteria],
    async () => await downloadWaterRights(searchCriteria!),
    {
      enabled: searchCriteria !== null
    }
  );
}
