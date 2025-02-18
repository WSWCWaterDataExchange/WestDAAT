import { useEffect, useState } from 'react';
import { useUrlParameters } from './useUrlParameters';
import { useTimeSeriesContext } from '../../components/home-page/water-rights-tab/sidebar-filtering/TimeSeriesProvider';

interface TimeSeriesUrlParams {
  minDate?: number;
  maxDate?: number;
  selectedSiteTypes?: string[];
  selectedPrimaryUseCategories?: string[];
  selectedVariableTypes?: string[];
  selectedWaterSourceTypes?: string[];
  timeSeries?: string[];
  isActive?: boolean;
}

export function useTimeSeriesUrlParameters() {
  const {
    timeSeries,
    minDate,
    maxDate,
    selectedSiteTypes,
    selectedPrimaryUseCategories,
    selectedVariableTypes,
    selectedWaterSourceTypes,
    isTimeSeriesFilterActive,
    setMinDate,
    setMaxDate,
    setSiteTypes,
    setPrimaryUseCategories,
    setVariableTypes,
    setWaterSourceTypes,
    setTimeSeriesFilterActive,
    toggleTimeSeries,
  } = useTimeSeriesContext();

  const { getParameter, setParameter } = useUrlParameters<TimeSeriesUrlParams | undefined>(
    'timeSeriesFilters',
    undefined,
  );

  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const urlParams = getParameter();
    if (!urlParams) {
      setHasInitialized(true);
      return;
    }

    setMinDate(urlParams.minDate);
    setMaxDate(urlParams.maxDate);
    setSiteTypes(urlParams.selectedSiteTypes);
    setPrimaryUseCategories(urlParams.selectedPrimaryUseCategories);
    setVariableTypes(urlParams.selectedVariableTypes);
    setWaterSourceTypes(urlParams.selectedWaterSourceTypes);
    urlParams.timeSeries?.forEach((ts) => toggleTimeSeries(ts, true));
    setTimeSeriesFilterActive(urlParams.isActive ?? false);

    setHasInitialized(true);
  }, [
    getParameter,
    setMinDate,
    setMaxDate,
    setSiteTypes,
    setPrimaryUseCategories,
    setVariableTypes,
    setWaterSourceTypes,
    toggleTimeSeries,
    setTimeSeriesFilterActive,
  ]);

  useEffect(() => {
    if (!hasInitialized) return;

    const hasFilters =
      minDate !== undefined ||
      maxDate !== undefined ||
      (selectedSiteTypes && selectedSiteTypes.length > 0) ||
      (selectedPrimaryUseCategories && selectedPrimaryUseCategories.length > 0) ||
      (selectedVariableTypes && selectedVariableTypes.length > 0) ||
      (selectedWaterSourceTypes && selectedWaterSourceTypes.length > 0) ||
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
      selectedPrimaryUseCategories,
      selectedVariableTypes,
      selectedWaterSourceTypes,
      timeSeries,
      isActive: isTimeSeriesFilterActive || undefined,
    };

    setParameter(paramValue);
  }, [
    minDate,
    maxDate,
    selectedSiteTypes,
    selectedPrimaryUseCategories,
    selectedVariableTypes,
    selectedWaterSourceTypes,
    timeSeries,
    isTimeSeriesFilterActive,
    setParameter,
    hasInitialized,
  ]);
}
