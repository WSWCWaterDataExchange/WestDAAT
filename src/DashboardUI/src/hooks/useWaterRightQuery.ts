import { useQuery } from 'react-query';
import {
  getWaterRightDetails,
  getWaterRightSiteInfoList,
  getWaterRightSourceInfoList,
  getWaterRightSiteLocations,
  findWaterRight,
} from '../accessors/waterAllocationAccessor';
import { WaterRightsSearchCriteria } from '../data-contracts/WaterRightsSearchCriteria';

export function useWaterRightDetails(waterRightId: number) {
  return useQuery(
    ['waterRight.Details', waterRightId],
    async () => await getWaterRightDetails(waterRightId),
    {
      enabled: !!waterRightId,
    }
  );
}

export function useFindWaterRights(searchCriteria: WaterRightsSearchCriteria | null){
  return useQuery(
    ['waterRight.Find', searchCriteria],
    async () => await findWaterRight(searchCriteria!),
    {
      enabled: searchCriteria !== null
    }
  );
}

export function useWaterRightSiteInfoList(waterRightId: number) {
  return useQuery(
    ['waterRight.SiteInfoList', waterRightId],
    async () => await getWaterRightSiteInfoList(waterRightId),
    {
      enabled: !!waterRightId,
    }
  );
}

export function useWaterRightSourceInfoList(waterRightId: number) {
  return useQuery(
    ['waterRight.SourceInfoList', waterRightId],
    async () => await getWaterRightSourceInfoList(waterRightId),
    {
      enabled: !!waterRightId,
    }
  );
}

export function useWaterRightSiteLocations(waterRightId: number) {
  return useQuery(
    ['waterRight.SiteLocations', waterRightId],
    async () => await getWaterRightSiteLocations(waterRightId),
    {
      enabled: !!waterRightId,
    }
  );
}
