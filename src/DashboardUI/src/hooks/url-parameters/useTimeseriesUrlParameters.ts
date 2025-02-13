import { useEffect } from 'react';
import { useUrlParameters } from './useUrlParameters';
import { useTimeSeriesContext } from '../../components/home-page/water-rights-tab/sidebar-filtering/TimeSeriesProvider';

interface TimeSeriesUrlParams {
  minDate?: number;
  maxDate?: number;
  selectedSiteTypes?: string[];
  timeSeries?: string[];
  isActive?: boolean;
}

export function useTimeSeriesUrlParameters() {
  const {
    timeSeries,
    minDate,
    maxDate,
    selectedSiteTypes,
    isTimeSeriesFilterActive,
    setMinDate,
    setMaxDate,
    setSiteTypes,
    setTimeSeriesFilterActive,
    toggleTimeSeries,
  } = useTimeSeriesContext();

  const { getParameter, setParameter } = useUrlParameters<TimeSeriesUrlParams | undefined>(
    'timeSeriesFilters',
    undefined,
  );

  useEffect(() => {
    const urlParams = getParameter();
    if (!urlParams) return;
    setMinDate(urlParams.minDate);
    setMaxDate(urlParams.maxDate);
    setSiteTypes(urlParams.selectedSiteTypes);

    urlParams.timeSeries?.forEach((ts) => toggleTimeSeries(ts, true));

    setTimeSeriesFilterActive(!!urlParams.isActive);
  }, [getParameter, setMinDate, setMaxDate, setSiteTypes, toggleTimeSeries, setTimeSeriesFilterActive]);

  useEffect(() => {
    const hasFilters =
      minDate !== undefined ||
      maxDate !== undefined ||
      (selectedSiteTypes && selectedSiteTypes.length > 0) ||
      timeSeries.length > 0;

    const shouldPersist = isTimeSeriesFilterActive || hasFilters;

    if (!shouldPersist) {
      setParameter(undefined);
      return;
    }

    const paramValue: TimeSeriesUrlParams = {
      minDate,
      maxDate,
      selectedSiteTypes,
      timeSeries,
      isActive: isTimeSeriesFilterActive || undefined,
    };

    setParameter(paramValue);
  }, [minDate, maxDate, selectedSiteTypes, timeSeries, isTimeSeriesFilterActive, setParameter]);
}
