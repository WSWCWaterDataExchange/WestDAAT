import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useDashboardFilters } from '../../../../hooks/queries';

interface TimeSeriesContextValue {
  timeSeries: string[];
  isTimeSeriesFilterActive: boolean;
  siteTypes: string[];
  selectedSiteTypes?: string[];
  minDate?: number;
  maxDate?: number;
  setMinDate: (date: number | undefined) => void;
  setMaxDate: (date: number | undefined) => void;

  toggleTimeSeries: (seriesKey: string, enable: boolean) => void;
  setTimeSeriesFilterActive: (active: boolean) => void;
  setSiteTypes: (siteTypes: string[] | undefined) => void;
}

const TimeSeriesContext = createContext<TimeSeriesContextValue>({
  timeSeries: [],
  isTimeSeriesFilterActive: false,
  siteTypes: [],
  selectedSiteTypes: [],
  minDate: undefined,
  maxDate: undefined,
  setMinDate: () => {},
  setMaxDate: () => {},
  toggleTimeSeries: () => {},
  setTimeSeriesFilterActive: () => {},
  setSiteTypes: () => {},
});

export function TimeSeriesProvider({ children }: { children: React.ReactNode }) {
  const dashboardFiltersQuery = useDashboardFilters();
  const siteTypes = dashboardFiltersQuery.data?.siteTypes ?? [];

  const [timeSeries, setTimeSeries] = useState<string[]>([]);
  const [selectedSiteTypes, setSelectedSiteTypes] = useState<string[] | undefined>(undefined);
  const [isTimeSeriesFilterActive, setTimeSeriesFilterActive] = useState<boolean>(false);
  const [minDate, setMinDate] = useState<number | undefined>(undefined);
  const [maxDate, setMaxDate] = useState<number | undefined>(undefined);

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
    minDate,
    maxDate,
    setMinDate,
    setMaxDate,
    toggleTimeSeries,
    setTimeSeriesFilterActive,
    setSiteTypes: setSelectedSiteTypes,
  };

  return <TimeSeriesContext.Provider value={value}>{children}</TimeSeriesContext.Provider>;
}

export function useTimeSeriesContext() {
  return useContext(TimeSeriesContext);
}
