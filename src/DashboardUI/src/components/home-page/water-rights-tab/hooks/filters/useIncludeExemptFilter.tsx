import React from 'react';
import { waterRightsProperties } from '../../../../../config/constants';
import { useEqualsFilter } from './useEqualsFilter';

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
