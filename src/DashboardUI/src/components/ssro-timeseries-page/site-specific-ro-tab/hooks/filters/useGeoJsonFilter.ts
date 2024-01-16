import { useCallback } from "react";
import { useSiteSpecificContext, SiteSpecificFilters } from "../../Provider";
import { useGeoJsonFilter as useGeoJsonFilterBase } from "../../../../../hooks/filters/useGeoJsonFilter";

type ValidGeoJsonFilters = 'polylines';
export function useGeoJsonFilter<K1 extends keyof Pick<SiteSpecificFilters, ValidGeoJsonFilters>>(field: K1) {
  const { filters: { [field]: value }, setFilters } = useSiteSpecificContext();

  const { mapFilters } = useGeoJsonFilterBase(value);

  const setValue = useCallback((val: typeof value) => {
    setFilters(s => ({
      ...s,
      [field]: val
    }));
  }, [field, setFilters]);

  return { value, setValue, mapFilters };
}
