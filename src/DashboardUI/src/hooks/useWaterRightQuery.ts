import { useQuery } from 'react-query';
import {
  getWaterRightDetails,
  getWaterRightSiteInfoList,
  getWaterRightSourceInfoList,
  getWaterRightSiteLocations,
  getRiverBasinPolygonsByName,
  getRiverBasinOptions,
} from '../accessors/waterAllocationAccessor';

export function useWaterRightDetails(waterRightId: number) {
  return useQuery(
    ['waterRight.Details', waterRightId],
    async () => await getWaterRightDetails(waterRightId),
    {
      enabled: !!waterRightId,
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

export function useRiverBasinOptions() {
  return useQuery(
    ['riverBasinOptions'],
    async () => await getRiverBasinOptions()
  );
}

export function useRiverBasinPolygonsByName(basinNames: string[]) {
  return useQuery(
    ['riverBasinPolygons', basinNames],
    async () => await getRiverBasinPolygonsByName(basinNames),
    {
      enabled: !!basinNames,
    }
  );
}
