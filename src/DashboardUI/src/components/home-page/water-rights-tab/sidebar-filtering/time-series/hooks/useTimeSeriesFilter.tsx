import { useMemo } from 'react';
import { useTimeSeriesContext } from '../../TimeSeriesProvider';
import { useNldiFilter } from '../../nldi/hooks/useNldiFilter';

export function useTimeSeriesFilter() {
  const {
    timeSeries,
    isTimeSeriesFilterActive,
    selectedSiteTypes,
    selectedStates,
    selectedPrimaryUseCategories,
    selectedVariableTypes,
    selectedWaterSourceTypes,
    minDate,
    maxDate,
    setTimeSeriesFilterActive,
    resetTimeSeriesOptions,
  } = useTimeSeriesContext();

  const { mapFilters: nldiMapFilters, isNldiFilterActive } = useNldiFilter();

  const siteTypeFilters = useMemo(() => {
    if (!selectedSiteTypes || selectedSiteTypes.length === 0) return null;
    return ['any', ...selectedSiteTypes.map((type) => ['==', ['get', 'siteType'], type])];
  }, [selectedSiteTypes]);

  const primaryUseCategoryFilters = useMemo(() => {
    if (!selectedPrimaryUseCategories || selectedPrimaryUseCategories.length === 0) return null;
    return ['any', ...selectedPrimaryUseCategories.map((category) => ['==', ['get', 'primaryUseCategory'], category])];
  }, [selectedPrimaryUseCategories]);

  const variableTypeFilters = useMemo(() => {
    if (!selectedVariableTypes || selectedVariableTypes.length === 0) return null;
    return ['any', ...selectedVariableTypes.map((type) => ['==', ['get', 'variableType'], type])];
  }, [selectedVariableTypes]);

  const waterSourceTypeFilters = useMemo(() => {
    if (!selectedWaterSourceTypes || selectedWaterSourceTypes.length === 0) return null;
    return ['any', ...selectedWaterSourceTypes.map((type) => ['==', ['get', 'waterSourceType'], type])];
  }, [selectedWaterSourceTypes]);

  const stateFilters = useMemo(() => {
    if (!selectedStates || selectedStates.length === 0) return null;
    const result = ['any', ...selectedStates.map((state) => ['==', ['get', 'state'], state])];
    return result;
  }, [selectedStates]);

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

    if (siteTypeFilters) filters.push(siteTypeFilters);
    if (primaryUseCategoryFilters) filters.push(primaryUseCategoryFilters);
    if (variableTypeFilters) filters.push(variableTypeFilters);
    if (waterSourceTypeFilters) filters.push(waterSourceTypeFilters);
    if (stateFilters) filters.push(stateFilters);
    if (dateFilters) filters.push(dateFilters);

    if (isTimeSeriesFilterActive && isNldiFilterActive && nldiMapFilters) {
      filters.push(nldiMapFilters);
    }

    return filters.length > 1 ? filters : null;
  }, [
    timeSeries,
    isTimeSeriesFilterActive,
    siteTypeFilters,
    primaryUseCategoryFilters,
    variableTypeFilters,
    waterSourceTypeFilters,
    stateFilters,
    dateFilters,
    isNldiFilterActive,
    nldiMapFilters,
  ]);

  return {
    timeSeries,
    isTimeSeriesFilterActive,
    selectedSiteTypes,
    selectedPrimaryUseCategories,
    selectedVariableTypes,
    selectedWaterSourceTypes,
    selectedStates,
    minDate,
    maxDate,
    mapFilters: combinedFilters,
    setTimeSeriesFilterActive,
    resetTimeSeriesOptions,
  };
}
