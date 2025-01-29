import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type MapboxFilterExpression = [string, ...any[]];

interface TimeSeriesContextValue {
  timeSeries: string[];
  isTimeSeriesFilterActive: boolean;
  timeSeriesData?: string[];

  toggleTimeSeries: (seriesKey: string, enable: boolean) => void;
  setTimeSeriesFilterActive: (active: boolean) => void;

  mapFilters: MapboxFilterExpression | null;
}

const TimeSeriesContext = createContext<TimeSeriesContextValue>({
  timeSeries: [],
  isTimeSeriesFilterActive: false,
  timeSeriesData: [], //might not need this when we add the filters
  toggleTimeSeries: () => {},
  setTimeSeriesFilterActive: () => {},
  mapFilters: null,
});

export function TimeSeriesProvider({ children }: { children: React.ReactNode }) {
  const [timeSeries, setTimeSeries] = useState<string[]>([]);
  const [isTimeSeriesFilterActive, setTimeSeriesFilterActive] = useState<boolean>(false);

  useEffect(() => {}, [timeSeries]);

  const toggleTimeSeries = useCallback((seriesKey: string, enable: boolean) => {
    setTimeSeries((prev) => {
      const current = prev ?? [];
      if (enable) {
        if (current.includes(seriesKey)) return current;
        return [...current, seriesKey];
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
    toggleTimeSeries,
    setTimeSeriesFilterActive,
    mapFilters,
  };

  return <TimeSeriesContext.Provider value={value}>{children}</TimeSeriesContext.Provider>;
}

export function useTimeSeriesContext() {
  return useContext(TimeSeriesContext);
}
