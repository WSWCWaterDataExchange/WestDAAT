import { waterRightsProperties } from "../../../../../config/constants";
import { siteSpecificProperties } from "../../../../../config/constants";
import { useInFilter } from "./useInFilter";

export function useBeneficialUsesFilter() {
  const {values, setValues, mapFilters} = useInFilter("beneficialUseNames", "beneficialUsesQuery", siteSpecificProperties.beneficialUses)
  return {
    beneficialUseNames: values,
    setBeneficialUseNames: setValues,
    mapFilters
  }
}


