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
return [
        'any',
        ...values.map((a) => [
          'in',
          JSON.stringify(a), // Ensures value is quoted to match stringified arrays in vector tiles, tileset limitation. Acts like a contains string match if we don't
          ['get', mapField]
        ])
      ];    }
  }, [values, mapField, areAllItemsSelected]);

  return { values, mapFilters };
}
