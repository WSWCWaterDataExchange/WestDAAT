import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useDashboardFilters } from '../../../../hooks/queries';

export type MapboxFilterExpression = [string, ...any[]];

interface OverlaysContextValue {
  overlays: string[];
  isOverlayFilterActive: boolean;
  overlaysData?: string[];

  toggleOverlay: (overlayKey: string, enable: boolean) => void;
  setOverlayFilterActive: (active: boolean) => void;
  resetOverlaysOptions: () => void;
  mapFilters: MapboxFilterExpression | null;
}

const OverlaysContext = createContext<OverlaysContextValue>({
  overlays: [],
  isOverlayFilterActive: false,
  overlaysData: [],
  toggleOverlay: () => {},
  setOverlayFilterActive: () => {},
  resetOverlaysOptions: () => {},
  mapFilters: null,
});

export function OverlaysProvider({ children }: { children: React.ReactNode }) {
  const dashboardFiltersQuery = useDashboardFilters();
  const overlaysData = dashboardFiltersQuery.data?.overlays ?? [];

  const [overlays, setOverlays] = useState<string[]>([]);
  const [isOverlayFilterActive, setOverlayFilterActive] = useState<boolean>(false);

  useEffect(() => {
    if (overlaysData.length && overlays.length === 0) {
      setOverlays(overlaysData.slice());
    }
  }, [overlaysData, overlays]);

  const toggleOverlay = useCallback((overlayKey: string, enable: boolean) => {
    setOverlays((prev) => {
      const current = prev ?? [];
      if (enable) {
        return current.includes(overlayKey) ? current : [...current, overlayKey];
      }
      return current.filter((o) => o !== overlayKey);
    });
  }, []);

  const resetOverlaysOptions = useCallback(() => {
    setOverlays([]);
    setOverlayFilterActive(false);
  }, []);

  const mapFilters = useMemo<MapboxFilterExpression | null>(() => {
    if (!isOverlayFilterActive || overlays.length === 0) {
      return null;
    }
    const exprs = overlays.map((key) => ['in', key, ['get', 'oType']]);
    return ['any', ...exprs];
  }, [isOverlayFilterActive, overlays]);

  const value: OverlaysContextValue = {
    overlays,
    isOverlayFilterActive,
    overlaysData,
    toggleOverlay,
    setOverlayFilterActive,
    resetOverlaysOptions,
    mapFilters,
  };

  return <OverlaysContext.Provider value={value}>{children}</OverlaysContext.Provider>;
}

export function useOverlaysContext() {
  return useContext(OverlaysContext);
}
