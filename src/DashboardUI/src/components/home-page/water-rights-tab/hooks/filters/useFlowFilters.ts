import { waterRightsProperties } from "../../../../../config/constants";
import { useRangeFilter } from "./useRangeFilter";


export function useFlowFilters() {
  return useRangeFilter("minFlow", "maxFlow", waterRightsProperties.minFlowRate, waterRightsProperties.maxFlowRate);
}
