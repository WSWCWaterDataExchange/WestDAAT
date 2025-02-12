import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useDashboardFilters } from '../../../../hooks/queries';

interface OverlaysContextValue {
  overlayTypes: string[];
  visibleOverlayTypes: string[];
  selectedOverlayTypes?: string[];
  states: string[];
  selectedStates?: string[];
  waterSourceTypes: string[];
  selectedWaterSourceTypes?: string[];
  isOverlayFilterActive: boolean;
  setOverlayFilterActive: (active: boolean) => void;
  setSelectedOverlayTypes: (types: string[] | undefined) => void;
  setStates: (states: string[] | undefined) => void;
  setWaterSourceTypes: (types: string[] | undefined) => void;
  resetOverlaysOptions: () => void;
}

const OverlaysContext = createContext<OverlaysContextValue>({
  overlayTypes: [],
  visibleOverlayTypes: [],
  selectedOverlayTypes: undefined,
  states: [],
  selectedStates: undefined,
  waterSourceTypes: [],
  selectedWaterSourceTypes: undefined,
  isOverlayFilterActive: false,
  setOverlayFilterActive: () => {},
  setSelectedOverlayTypes: () => {},
  setStates: () => {},
  setWaterSourceTypes: () => {},
  resetOverlaysOptions: () => {},
});

export function OverlaysProvider({ children }: { children: React.ReactNode }) {
  const dashboardFiltersQuery = useDashboardFilters();

  const overlayTypes = dashboardFiltersQuery.data?.overlays ?? [];
  const states = dashboardFiltersQuery.data?.states ?? [];
  const waterSourceTypes = dashboardFiltersQuery.data?.waterSources ?? [];

  const [selectedOverlayTypes, setSelectedOverlayTypes] = useState<string[] | undefined>(undefined);
  const [visibleOverlayTypes, setVisibleOverlayTypes] = useState<string[]>(overlayTypes);
  const [selectedStates, setSelectedStates] = useState<string[] | undefined>(undefined);
  const [selectedWaterSourceTypes, setSelectedWaterSourceTypes] = useState<string[] | undefined>(undefined);
  const [isOverlayFilterActive, setOverlayFilterActive] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedOverlayTypes || selectedOverlayTypes.length === 0) {
      setVisibleOverlayTypes(overlayTypes);
    } else {
      setVisibleOverlayTypes(selectedOverlayTypes);
    }
  }, [selectedOverlayTypes, overlayTypes]);

  const resetOverlaysOptions = useCallback(() => {
    setSelectedOverlayTypes(undefined);
    setVisibleOverlayTypes(overlayTypes);
    setSelectedStates(undefined);
    setSelectedWaterSourceTypes(undefined);
    setOverlayFilterActive(false);
  }, [overlayTypes]);

  const value: OverlaysContextValue = {
    overlayTypes,
    visibleOverlayTypes,
    selectedOverlayTypes,
    states,
    selectedStates,
    waterSourceTypes,
    selectedWaterSourceTypes,
    isOverlayFilterActive,
    setOverlayFilterActive,
    setSelectedOverlayTypes,
    setStates: setSelectedStates,
    setWaterSourceTypes: setSelectedWaterSourceTypes,
    resetOverlaysOptions,
  };

  return <OverlaysContext.Provider value={value}>{children}</OverlaysContext.Provider>;
}

export function useOverlaysContext() {
  return useContext(OverlaysContext);
}
