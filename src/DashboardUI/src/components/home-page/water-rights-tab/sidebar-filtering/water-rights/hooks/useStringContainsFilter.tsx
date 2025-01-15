import { useCallback } from 'react';
import { useWaterRightsContext, WaterRightsFilters } from '../../Provider';
import { waterRightsProperties } from '../../../../../../config/constants';
import { useStringContainsFilter as useStringContainsFilterBase } from '../../../../../../hooks/filters/useStringContainsFilter';

type ValidStringContainsFilters = 'allocationOwner';
export function useStringContainsFilter<K1 extends keyof Pick<WaterRightsFilters, ValidStringContainsFilters>>(
  field: K1,
  mapField: waterRightsProperties,
) {
  const {
    filters: { [field]: value },
    setFilters,
  } = useWaterRightsContext();

  const { mapFilters } = useStringContainsFilterBase(value, mapField);

  const setValue = useCallback(
    (val: typeof value) => {
      setFilters((s) => ({
        ...s,
        [field]: val,
      }));
    },
    [field, setFilters],
  );

  return { value, setValue, mapFilters };
}
