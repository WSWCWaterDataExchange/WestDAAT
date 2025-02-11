import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useDashboardFilters } from '../../../../hooks/queries';

interface OverlaysContextValue {
  overlayTypes: string[];
  selectedOverlayTypes: string[];
  states: string[];
  selectedStates?: string[];
  waterSourceTypes: string[];
  selectedWaterSourceTypes?: string[];
  isOverlayFilterActive: boolean;
  setOverlayFilterActive: (active: boolean) => void;
  setOverlayTypes: (types: string[]) => void;
  setStates: (states: string[] | undefined) => void;
  setWaterSourceTypes: (types: string[] | undefined) => void;
  resetOverlaysOptions: () => void;
}

const OverlaysContext = createContext<OverlaysContextValue>({
  overlayTypes: [],
  selectedOverlayTypes: [],
  states: [],
  selectedStates: [],
  waterSourceTypes: [],
  selectedWaterSourceTypes: [],
  isOverlayFilterActive: false,
  setOverlayFilterActive: () => {},
  setOverlayTypes: () => {},
  setStates: () => {},
  setWaterSourceTypes: () => {},
  resetOverlaysOptions: () => {},
});

export function OverlaysProvider({ children }: { children: React.ReactNode }) {
  const dashboardFiltersQuery = useDashboardFilters();

  const overlayTypes = dashboardFiltersQuery.data?.overlays ?? [];
  const states = dashboardFiltersQuery.data?.states ?? [];
  const waterSourceTypes = dashboardFiltersQuery.data?.waterSources ?? [];

  const [selectedOverlayTypes, setSelectedOverlayTypes] = useState<string[]>(overlayTypes);
  const [selectedStates, setSelectedStates] = useState<string[] | undefined>(undefined);
  const [selectedWaterSourceTypes, setSelectedWaterSourceTypes] = useState<string[] | undefined>(undefined);
  const [isOverlayFilterActive, setOverlayFilterActive] = useState<boolean>(false);

  useEffect(() => {
    if (selectedOverlayTypes.length === 0 && overlayTypes.length > 0) {
      setSelectedOverlayTypes(overlayTypes);
    }
  }, [overlayTypes, selectedOverlayTypes]);

  const resetOverlaysOptions = useCallback(() => {
    setSelectedOverlayTypes([]);
    setSelectedStates(undefined);
    setSelectedWaterSourceTypes(undefined);
    setOverlayFilterActive(false);
  }, []);

  const value: OverlaysContextValue = {
    overlayTypes,
    selectedOverlayTypes,
    states,
    selectedStates,
    waterSourceTypes,
    selectedWaterSourceTypes,
    isOverlayFilterActive,
    setOverlayFilterActive,
    setOverlayTypes: setSelectedOverlayTypes,
    setStates: setSelectedStates,
    setWaterSourceTypes: setSelectedWaterSourceTypes,
    resetOverlaysOptions,
  };

  return <OverlaysContext.Provider value={value}>{children}</OverlaysContext.Provider>;
}

export function useOverlaysContext() {
  return useContext(OverlaysContext);
}
