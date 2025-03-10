import { waterRightsProperties } from '../../../../../../config/constants';
import { useRangeFilter } from './useRangeFilter';

export function usePriorityDateFilters() {
  return useRangeFilter(
    'minPriorityDate',
    'maxPriorityDate',
    waterRightsProperties.minPriorityDate,
    waterRightsProperties.maxPriorityDate,
  );
}
