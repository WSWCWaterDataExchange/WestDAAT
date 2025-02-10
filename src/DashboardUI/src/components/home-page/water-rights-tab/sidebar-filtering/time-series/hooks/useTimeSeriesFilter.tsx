import { useMemo } from 'react';
import { useTimeSeriesContext } from '../../TimeSeriesProvider';

export function useTimeSeriesFilter() {
  const {
    timeSeries,
    isTimeSeriesFilterActive,
    selectedSiteTypes,
    minDate,
    maxDate,
    setTimeSeriesFilterActive,
    resetTimeSeriesOptions,
  } = useTimeSeriesContext();

  const siteTypeFilters = useMemo(() => {
    if (!selectedSiteTypes || selectedSiteTypes.length === 0) return null;
    return ['in', ['get', 'siteType'], ...selectedSiteTypes];
  }, [selectedSiteTypes]);

  const dateFilters = useMemo(() => {
    if (minDate === undefined && maxDate === undefined) return null;

    const filters: any[] = [];

    if (minDate !== undefined) {
      filters.push(['>=', ['get', 'endDate'], minDate]);
    }

    if (maxDate !== undefined) {
      filters.push(['<=', ['get', 'startDate'], maxDate]);
    }

    return filters.length > 0 ? ['all', ...filters] : null;
  }, [minDate, maxDate]);

  const combinedFilters = useMemo(() => {
    if (!isTimeSeriesFilterActive) return null;

    const filters: any[] = ['all'];

    if (timeSeries.length > 0) {
      filters.push(['in', ['get', 'uuid'], ...timeSeries]);
    }

    if (siteTypeFilters) {
      filters.push(siteTypeFilters);
    }

    if (dateFilters) {
      filters.push(dateFilters);
    }

    return filters.length > 1 ? filters : null;
  }, [timeSeries, isTimeSeriesFilterActive, siteTypeFilters, dateFilters]);

  return {
    timeSeries,
    isTimeSeriesFilterActive,
    selectedSiteTypes,
    minDate,
    maxDate,
    mapFilters: combinedFilters,
    setTimeSeriesFilterActive,
    resetTimeSeriesOptions,
  };
}
