import { useQuery } from 'react-query';
import { getWaterRightDetails } from '../accessors/waterAllocationAccessor';

export default function useWaterRightDetails(waterRightId: number) {
  return useQuery(['waterRightDetails', waterRightId], () =>
    getWaterRightDetails(waterRightId)
  );
}
