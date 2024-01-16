import { siteSpecificProperties } from "../../../../../config/constants";
import { useInFilter } from "./useInFilter";


export function useStatesFilter() {
  const { values, setValues, mapFilters } = useInFilter("states", "statesQuery", siteSpecificProperties.states);
  return {
    states: values,
    setStates: setValues,
    mapFilters
  };
}
