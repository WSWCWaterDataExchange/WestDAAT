import { useQuery } from 'react-query';
import {
  getWaterRightDetails,
  getWaterRightSiteInfoList,
  getWaterRightSourceInfoList,
  getWaterRightSiteLocations
} from '../accessors/waterAllocationAccessor';

export function useWaterRightDetails(waterRightId: number) {
  return useQuery(['waterRightDetails', waterRightId],
    async () => await getWaterRightDetails(waterRightId),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      cacheTime: 8600000,
      staleTime: Infinity
    }
  );
}

export function useWaterRightSiteInfoList(waterRightId: number) {
  return useQuery(['waterRightSiteInfoList', waterRightId],
    async () => await getWaterRightSiteInfoList(waterRightId),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      cacheTime: 8600000,
      staleTime: Infinity
    }
  );
}

export function useWaterRightSourceInfoList(waterRightId: number) {
  return useQuery(['waterRightSourceInfoList', waterRightId],
    async () => await getWaterRightSourceInfoList(waterRightId),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      cacheTime: 8600000,
      staleTime: Infinity
    }
  );
}

export function useWaterRightSiteLocations(waterRightId: number) {
  return useQuery(
    ['waterRightSiteLocations', waterRightId],
    async () => await getWaterRightSiteLocations(waterRightId),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      cacheTime: 8600000,
      staleTime: Infinity
    })
}