import { useTimeSeriesContext } from '../../TimeSeriesProvider';

export function useTimeSeriesFilter() {
  const {
    timeSeries,
    isTimeSeriesFilterActive,
    timeSeriesData,
    toggleTimeSeries,
    setTimeSeriesFilterActive,
    mapFilters,
  } = useTimeSeriesContext();

  return {
    timeSeries,
    isTimeSeriesFilterActive,
    timeSeriesData,
    toggleTimeSeries,
    setTimeSeriesFilterActive,
    mapFilters,
  };
}
