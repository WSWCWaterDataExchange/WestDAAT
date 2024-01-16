import { useCallback } from "react";
import { HostData, useSiteSpecificContext, SiteSpecificFilters } from "../../Provider";
import { siteSpecificProperties } from "../../../../../config/constants";
import { useInFilter as useInFilterBase } from "../../../../../hooks/filters/useInFilter";

type ValidInFilters = 'beneficialUseNames' | 'states' | 'waterSourceTypes';
export function useInFilter<K1 extends keyof Pick<SiteSpecificFilters, ValidInFilters>, K2 extends keyof HostData>(field: K1, hostData: K2, mapField: siteSpecificProperties) {
  const { filters: { [field]: val }, setFilters, hostData: { [hostData]: { data: allValues } } } = useSiteSpecificContext();

  const {values, mapFilters} = useInFilterBase(val, allValues?.length, mapField)

  const setValues = useCallback((values: typeof val) => {
    setFilters(s => ({
      ...s,
      [field]: values === undefined ? undefined : [...new Set(values)]
    }));
  }, [field, setFilters]);

  return { values, setValues, mapFilters };
}

