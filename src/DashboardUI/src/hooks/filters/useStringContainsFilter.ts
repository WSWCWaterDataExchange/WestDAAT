import { useMemo } from 'react';

export function useStringContainsFilter(
  value: string | undefined,
  mapField: string,
) {
  const mapFilters = useMemo((): any[] | undefined => {
    if (value !== undefined) {
      return ['in', value.toUpperCase(), ['upcase', ['get', mapField]]];
    }
  }, [value, mapField]);

  return { mapFilters };
}
