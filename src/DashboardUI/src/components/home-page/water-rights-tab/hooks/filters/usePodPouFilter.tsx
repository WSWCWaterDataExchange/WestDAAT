import { waterRightsProperties } from "../../../../../config/constants";
import { useEqualsFilter } from "./useEqualsFilter";


export function usePodPouFilter() {
  const { value, setValue, mapFilters } = useEqualsFilter("podPou", waterRightsProperties.sitePodOrPou);
  return {
    podPou: value,
    setPodPou: setValue,
    mapFilters
  };
}
