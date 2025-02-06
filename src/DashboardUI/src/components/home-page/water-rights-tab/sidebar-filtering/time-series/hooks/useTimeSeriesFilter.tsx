import { useMemo } from 'react';
import { useTimeSeriesContext } from '../../TimeSeriesProvider';

export function useTimeSeriesFilter() {
  const {
    timeSeries,
    isTimeSeriesFilterActive,
    selectedSiteTypes,
    setSiteTypes,
    toggleTimeSeries,
    setTimeSeriesFilterActive,
    mapFilters,
  } = useTimeSeriesContext();

  const siteTypeFilters = useMemo(() => {
    if (!selectedSiteTypes || selectedSiteTypes.length === 0) return null;
    return ['in', ['get', 'siteType'], ...selectedSiteTypes];
  }, [selectedSiteTypes]);

  const combinedFilters = useMemo(() => {
    const filters: any[] = ['all'];
    if (mapFilters) filters.push(mapFilters);
    if (siteTypeFilters) filters.push(siteTypeFilters);

    return filters.length > 1 ? filters : null;
  }, [mapFilters, siteTypeFilters]);

  return {
    timeSeries,
    isTimeSeriesFilterActive,
    selectedSiteTypes,
    setSiteTypes,
    toggleTimeSeries,
    setTimeSeriesFilterActive,
    mapFilters: combinedFilters,
  };
}
