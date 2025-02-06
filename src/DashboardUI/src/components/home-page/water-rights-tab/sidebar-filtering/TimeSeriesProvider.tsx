import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useDashboardFilters } from '../../../../hooks/queries';

export type MapboxFilterExpression = [string, ...any[]];

interface TimeSeriesContextValue {
  timeSeries: string[];
  isTimeSeriesFilterActive: boolean;
  siteTypes: string[];
  selectedSiteTypes?: string[];

  toggleTimeSeries: (seriesKey: string, enable: boolean) => void;
  setTimeSeriesFilterActive: (active: boolean) => void;
  setSiteTypes: (siteTypes: string[] | undefined) => void;

  mapFilters: MapboxFilterExpression | null;
}

const TimeSeriesContext = createContext<TimeSeriesContextValue>({
  timeSeries: [],
  isTimeSeriesFilterActive: false,
  siteTypes: [],
  selectedSiteTypes: [],
  toggleTimeSeries: () => {},
  setTimeSeriesFilterActive: () => {},
  setSiteTypes: () => {},
  mapFilters: null,
});

export function TimeSeriesProvider({ children }: { children: React.ReactNode }) {
  const dashboardFiltersQuery = useDashboardFilters();
  const siteTypes = dashboardFiltersQuery.data?.siteTypes ?? [];

  const [timeSeries, setTimeSeries] = useState<string[]>([]);
  const [selectedSiteTypes, setSelectedSiteTypes] = useState<string[] | undefined>(undefined);
  const [isTimeSeriesFilterActive, setTimeSeriesFilterActive] = useState<boolean>(false);

  useEffect(() => {}, [timeSeries]);

  const toggleTimeSeries = useCallback((seriesKey: string, enable: boolean) => {
    setTimeSeries((prev) => {
      const current = prev ?? [];
      if (enable) {
        return current.includes(seriesKey) ? current : [...current, seriesKey];
      }
      return current.filter((o) => o !== seriesKey);
    });
  }, []);

  const mapFilters = useMemo<MapboxFilterExpression | null>(() => {
    if (!isTimeSeriesFilterActive || timeSeries.length === 0) {
      return null;
    }
    const exprs = timeSeries.map((key) => ['==', ['get', 'startDate'], key]);
    return ['any', ...exprs];
  }, [isTimeSeriesFilterActive, timeSeries]);

  const value: TimeSeriesContextValue = {
    timeSeries,
    isTimeSeriesFilterActive,
    siteTypes,
    selectedSiteTypes,
    toggleTimeSeries,
    setTimeSeriesFilterActive,
    setSiteTypes: setSelectedSiteTypes,
    mapFilters,
  };

  return <TimeSeriesContext.Provider value={value}>{children}</TimeSeriesContext.Provider>;
}

export function useTimeSeriesContext() {
  return useContext(TimeSeriesContext);
}
