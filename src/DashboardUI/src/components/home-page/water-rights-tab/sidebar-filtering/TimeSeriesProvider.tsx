import React, { createContext, useCallback, useContext, useState } from 'react';
import { useDashboardFilters } from '../../../../hooks/queries';

export interface TimeSeriesContextValue {
  timeSeries: string[];
  isTimeSeriesFilterActive: boolean;
  siteTypes: string[];
  selectedSiteTypes?: string[];
  primaryUseCategories: string[];
  selectedPrimaryUseCategories?: string[];
  variableTypes: string[];
  selectedVariableTypes?: string[];
  waterSourceTypes: string[];
  selectedWaterSourceTypes?: string[];
  minDate?: number;
  maxDate?: number;
  setMinDate: (date: number | undefined) => void;
  setMaxDate: (date: number | undefined) => void;
  toggleTimeSeries: (seriesKey: string, enable: boolean) => void;
  setTimeSeriesFilterActive: (active: boolean) => void;
  setSiteTypes: (siteTypes: string[] | undefined) => void;
  setPrimaryUseCategories: (categories: string[] | undefined) => void;
  setVariableTypes: (types: string[] | undefined) => void;
  setWaterSourceTypes: (types: string[] | undefined) => void;
  resetTimeSeriesOptions: () => void;
  states: string[];
  selectedStates?: string[];
  setStates: (states: string[] | undefined) => void;
}

export const TimeSeriesContext = createContext<TimeSeriesContextValue>({
  timeSeries: [],
  isTimeSeriesFilterActive: false,
  siteTypes: [],
  selectedSiteTypes: [],
  primaryUseCategories: [],
  selectedPrimaryUseCategories: [],
  variableTypes: [],
  selectedVariableTypes: [],
  waterSourceTypes: [],
  selectedWaterSourceTypes: [],
  minDate: undefined,
  maxDate: undefined,
  setMinDate: () => {},
  setMaxDate: () => {},
  toggleTimeSeries: () => {},
  setTimeSeriesFilterActive: () => {},
  setSiteTypes: () => {},
  setPrimaryUseCategories: () => {},
  setVariableTypes: () => {},
  setWaterSourceTypes: () => {},
  resetTimeSeriesOptions: () => {},
  states: [],
  selectedStates: [],
  setStates: () => {},
});

export function TimeSeriesProvider({ children }: { children: React.ReactNode }) {
  const dashboardFiltersQuery = useDashboardFilters();

  const siteTypes = dashboardFiltersQuery.data?.waterRights.siteTypes ?? [];
  const primaryUseCategories =
    dashboardFiltersQuery.data?.waterRights.beneficialUses.map(u => u.beneficialUseName) ?? [];
  const variableTypes = dashboardFiltersQuery.data?.timeSeries.variableTypes ?? [];
  const waterSourceTypes = dashboardFiltersQuery.data?.waterRights.waterSourceTypes ?? [];
  const states = dashboardFiltersQuery.data?.waterRights.states ?? [];


  const [timeSeries, setTimeSeries] = useState<string[]>([]);
  const [selectedSiteTypes, setSelectedSiteTypes] = useState<string[] | undefined>(undefined);
  const [selectedPrimaryUseCategories, setSelectedPrimaryUseCategories] = useState<string[] | undefined>(undefined);
  const [selectedVariableTypes, setSelectedVariableTypes] = useState<string[] | undefined>(undefined);
  const [selectedWaterSourceTypes, setSelectedWaterSourceTypes] = useState<string[] | undefined>(undefined);
  const [isTimeSeriesFilterActive, setTimeSeriesFilterActive] = useState<boolean>(false);
  const [minDate, setMinDate] = useState<number | undefined>(undefined);
  const [maxDate, setMaxDate] = useState<number | undefined>(undefined);
  const [selectedStates, setSelectedStates] = useState<string[] | undefined>(undefined);

  const resetTimeSeriesOptions = useCallback(() => {
    setTimeSeries([]);
    setSelectedSiteTypes(undefined);
    setSelectedPrimaryUseCategories(undefined);
    setSelectedVariableTypes(undefined);
    setSelectedWaterSourceTypes(undefined);
    setMinDate(undefined);
    setMaxDate(undefined);
    setTimeSeriesFilterActive(false);
    setSelectedStates(undefined);
  }, []);

  const toggleTimeSeries = useCallback((seriesKey: string, enable: boolean) => {
    setTimeSeries((prev) => {
      const current = prev ?? [];
      return enable ? [...new Set([...current, seriesKey])] : current.filter((o) => o !== seriesKey);
    });
  }, []);

  const value: TimeSeriesContextValue = {
    timeSeries,
    isTimeSeriesFilterActive,
    siteTypes,
    selectedSiteTypes,
    primaryUseCategories,
    selectedPrimaryUseCategories,
    variableTypes,
    selectedVariableTypes,
    waterSourceTypes,
    selectedWaterSourceTypes,
    minDate,
    maxDate,
    setMinDate,
    setMaxDate,
    toggleTimeSeries,
    setTimeSeriesFilterActive,
    setSiteTypes: setSelectedSiteTypes,
    setPrimaryUseCategories: setSelectedPrimaryUseCategories,
    setVariableTypes: setSelectedVariableTypes,
    setWaterSourceTypes: setSelectedWaterSourceTypes,
    resetTimeSeriesOptions,
    states,
    selectedStates,
    setStates: setSelectedStates,
  };

  return <TimeSeriesContext.Provider value={value}>{children}</TimeSeriesContext.Provider>;
}

export function useTimeSeriesContext() {
  return useContext(TimeSeriesContext);
}
