import { useCallback } from "react";
import { HostData, useWaterRightsContext, WaterRightsFilters } from "../../Provider";
import { waterRightsProperties } from "../../../../../config/constants";
import { useInFilter as useInFilterBase } from "../../../../../hooks/filters/useInFilter";

type ValidInFilters = 'beneficialUseNames' | 'states' | 'ownerClassifications' | 'waterSourceTypes' | 'allocationTypes';
export function useInFilter<K1 extends keyof Pick<WaterRightsFilters, ValidInFilters>, K2 extends keyof HostData>(field: K1, hostData: K2, mapField: waterRightsProperties) {
  const { filters: { [field]: val }, setFilters, hostData: { [hostData]: { data: allValues } } } = useWaterRightsContext();

  const {values, mapFilters} = useInFilterBase(val, allValues?.length, mapField)

  const setValues = useCallback((values: typeof val) => {
    setFilters(s => ({
      ...s,
      [field]: values === undefined ? undefined : [...new Set(values)]
    }));
  }, [field, setFilters]);

  return { values, setValues, mapFilters };
}

