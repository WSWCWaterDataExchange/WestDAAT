import { useMemo } from 'react';

export function useRangeFilter<T>(
  minValue: T | undefined,
  maxValue: T | undefined,
  minMapField: string,
  maxMapField: string,
) {
  const mapFilters = useMemo((): any[] | undefined => {
    const buildRangeFilter = (
      field: string,
      value: T,
      isMin: boolea,
    ): any[] => {
      const fieldStr = field as string;
      const operator = isMin ? '<=' : '>=';

      let coalesceValue;
      if (isMin) {
        coalesceValue = -999999999999;
      } else {
        coalesceValue = 999999999999;
      }
      return [operator, value, ['coalesce', ['get', fieldStr], coalesceValue]];
    };
    const mapFilters = [];
    if (minValue !== undefined) {
      mapFilters.push(buildRangeFilter(minMapField, minValue, true));
    }
    if (maxValue !== undefined) {
      mapFilters.push(buildRangeFilter(maxMapField, maxValue, false));
    }
    if (mapFilters.length > 0) {
      return ['all', ...mapFilters];
    }
  }, [minValue, maxValue, minMapField, maxMapField]);

  return { mapFilters };
}
