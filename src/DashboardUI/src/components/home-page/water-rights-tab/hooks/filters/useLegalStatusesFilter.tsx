import {useInFilter} from "./useInFilter";
import {waterRightsProperties} from "../../../../../config/constants";

export function useLegalStatusesFilter() {
    const {
        values,
        setValues,
        mapFilters
    } = useInFilter('legalStatuses', 'legalStatusesQuery', waterRightsProperties.legalStatuses);
    return {
        legalStatuses: values,
        setLegalStatuses: setValues,
        mapFilters
    };
}