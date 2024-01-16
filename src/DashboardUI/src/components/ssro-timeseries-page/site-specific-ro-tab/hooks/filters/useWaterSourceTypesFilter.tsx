import { siteSpecificProperties } from "../../../../../config/constants";
import { useInFilter } from "./useInFilter";


export function useWaterSourceTypesFilter() {
  const { values, setValues, mapFilters } = useInFilter("waterSourceTypes", "waterSourcesQuery", siteSpecificProperties.waterSourceTypes);
  return {
    waterSourceTypes: values,
    setWaterSourceTypes: setValues,
    mapFilters
  };
}
