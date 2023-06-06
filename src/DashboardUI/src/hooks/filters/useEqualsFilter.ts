import { useMemo } from "react";


export function useEqualsFilter<T>(value: T | undefined, mapField: string) {
  const mapFilters = useMemo((): any[] | undefined => {
    if (value !== undefined) {
      return ["==", ["get", mapField], value];
    }
  }, [value, mapField]);

  return { mapFilters };
}

