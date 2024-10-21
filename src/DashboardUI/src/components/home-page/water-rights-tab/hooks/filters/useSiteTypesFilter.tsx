import { useInFilter } from './useInFilter';
import { waterRightsProperties } from '../../../../../config/constants';

export function useSiteTypesFilter() {
  const { values, setValues, mapFilters } = useInFilter(
    'siteTypes',
    'siteTypesQuery',
    waterRightsProperties.siteTypes,
  );
  return {
    siteTypes: values,
    setSiteTypes: setValues,
    mapFilters,
  };
}
