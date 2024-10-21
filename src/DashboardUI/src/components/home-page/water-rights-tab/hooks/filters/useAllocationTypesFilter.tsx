import {useInFilter} from "./useInFilter";
import {waterRightsProperties} from "../../../../../config/constants";

export function useAllocationTypesFilter() {
    const {
        values,
        setValues,
        mapFilters
    } = useInFilter('allocationTypes', 'allocationTypesQuery', waterRightsProperties.allocationTypes)
    return {
        allocationTypes: values,
        setAllocationTypes: setValues,
        mapFilters
    };
}