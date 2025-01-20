import { waterRightsProperties } from '../../../../../../config/constants';
import { useEqualsFilter } from '../../../map-options/hooks/useEqualsFilter';

export function useIncludeExemptFilter() {
  const { value, setValue, mapFilters } = useEqualsFilter(
    'includeExempt',
    waterRightsProperties.exemptOfVolumeFlowPriority,
  );
  return {
    includeExempt: value,
    setIncludeExempt: setValue,
    mapFilters,
  };
}
