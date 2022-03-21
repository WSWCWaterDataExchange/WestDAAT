import { useQuery } from 'react-query';
import {
  getWaterRightDetails,
  getWaterRightSiteInfoList,
  getWaterRightSiteLocations,
  getWaterRightSourceInfoList,
} from '../accessors/waterAllocationAccessor';

export function useWaterRightDetails(waterRightId: number) {
  return useQuery(['waterRightDetails', waterRightId], () =>
    getWaterRightDetails(waterRightId)
  );
}

export function useWaterRightSiteInfoList(waterRightId: number) {
  return useQuery(['waterRightSiteInfoList', waterRightId], () =>
    getWaterRightSiteInfoList(waterRightId)
  );
}

export function useWaterRightSourceInfoList(waterRightId: number) {
  return useQuery(['waterRightSourceInfoList', waterRightId], () =>
    getWaterRightSourceInfoList(waterRightId)
  );
}

export function useWaterRightSiteLocations(waterRightId: number) {
  return useQuery(['waterRightSiteLocations', waterRightId], () =>
    getWaterRightSiteLocations(waterRightId)
  );
}
