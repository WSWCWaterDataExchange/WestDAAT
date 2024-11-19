import { waterRightsProperties } from '../../../../../config/constants';
import { useRangeFilter } from './useRangeFilter';

export function useVolumeFilters() {
  return useRangeFilter(
    'minVolume',
    'maxVolume',
    waterRightsProperties.minVolume,
    waterRightsProperties.maxVolume,
  );
}
