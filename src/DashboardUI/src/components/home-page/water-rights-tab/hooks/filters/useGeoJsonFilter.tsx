import { useCallback, useContext } from "react";
import { WaterRightsContext, WaterRightsFilters } from "../../Provider";
import { useGeoJsonFilter as useGeoJsonFilterBase } from "../../../../../hooks/filters/useGeoJsonFilter";

type ValidGeoJsonFilters = 'polylines';
export function useGeoJsonFilter<K1 extends keyof Pick<WaterRightsFilters, ValidGeoJsonFilters>>(field: K1) {
  const { filters: { [field]: value }, setFilters } = useContext(WaterRightsContext);

  const { mapFilters } = useGeoJsonFilterBase(value);

  const setValue = useCallback((val: typeof value) => {
    setFilters(s => ({
      ...s,
      [field]: val
    }));
  }, [field, setFilters]);

  return { value, setValue, mapFilters };
}
