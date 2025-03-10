import { useMemo } from 'react';

export function useInFilter<T>(vals: T[] | undefined, allValuesCount: number | undefined, mapField: string) {
  const values = useMemo(() => {
    return [...new Set(vals)].sort() ?? [];
  }, [vals]);

  const areAllItemsSelected = useMemo(() => {
    return allValuesCount && values.length === allValuesCount;
  }, [values, allValuesCount]);

  const mapFilters = useMemo((): any[] | undefined => {
    if (values.length > 0 && !areAllItemsSelected) {
      return ['any', ...values.map((a) => ['in', a, ['get', mapField]])];
    }
  }, [values, mapField, areAllItemsSelected]);

  return { values, mapFilters };
}
