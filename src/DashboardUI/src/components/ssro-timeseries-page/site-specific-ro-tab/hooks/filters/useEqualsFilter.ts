import { useCallback } from "react";
import { useSiteSpecificContext, SiteSpecificFilters } from "../../Provider";
import { siteSpecificProperties } from "../../../../../config/constants";
import { useEqualsFilter as useEqualsFilterBase } from "../../../../../hooks/filters/useEqualsFilter";

type ValidEqualsFilters = 'podPou';
export function useEqualsFilter<K1 extends keyof Pick<SiteSpecificFilters, ValidEqualsFilters>>(field: K1, mapField: siteSpecificProperties) {
  const { filters: { [field]: value }, setFilters } = useSiteSpecificContext();

  const { mapFilters } = useEqualsFilterBase(value, mapField);

  const setValue = useCallback((val: typeof value) => {
    setFilters(s => ({
      ...s,
      [field]: val
    }));
  }, [field, setFilters]);

  return { value, setValue, mapFilters };
}

