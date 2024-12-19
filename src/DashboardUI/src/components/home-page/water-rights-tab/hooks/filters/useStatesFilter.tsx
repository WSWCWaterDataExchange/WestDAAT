import { waterRightsProperties } from '../../../../../config/constants';
import { useInFilter } from './useInFilter';

export function useStatesFilter() {
  const { values, setValues, mapFilters } = useInFilter('states', 'statesQuery', waterRightsProperties.states);
  return {
    states: values,
    setStates: setValues,
    mapFilters,
  };
}
