import { waterRightsProperties } from "../../../../../config/constants";
import { useStringContainsFilter } from "./useStringContainsFilter";


export function useAllocationOwnerFilter() {
  const { value, setValue, mapFilters } = useStringContainsFilter("allocationOwner", waterRightsProperties.owners);
  return {
    allocationOwner: value,
    setAllocationOwner: setValue,
    mapFilters
  };
}
