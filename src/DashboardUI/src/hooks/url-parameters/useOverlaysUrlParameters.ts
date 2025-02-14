import { useEffect, useState } from 'react';
import { useUrlParameters } from './useUrlParameters';
import { useOverlaysFilter } from '../../components/home-page/water-rights-tab/sidebar-filtering/overlays/hooks/useOverlaysFilter';

interface OverlaysUrlParams {
  selectedOverlayTypes?: string[];
  selectedStates?: string[];
  selectedWaterSourceTypes?: string[];
  isActive?: boolean;
}

export function useOverlaysUrlParameters() {
  const {
    selectedOverlayTypes,
    selectedStates,
    selectedWaterSourceTypes,
    isOverlayFilterActive,
    setSelectedOverlayTypes,
    setStates,
    setWaterSourceTypes,
    setOverlayFilterActive,
  } = useOverlaysFilter();

  const { getParameter, setParameter } = useUrlParameters<OverlaysUrlParams | undefined>('overlayFilters', undefined);

  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const urlParams = getParameter();
    if (!urlParams) {
      setHasInitialized(true);
      return;
    }

    setSelectedOverlayTypes(urlParams.selectedOverlayTypes);
    setStates(urlParams.selectedStates);
    setWaterSourceTypes(urlParams.selectedWaterSourceTypes);

    setOverlayFilterActive(urlParams.isActive ?? false);

    setHasInitialized(true);
  }, [getParameter, setSelectedOverlayTypes, setStates, setWaterSourceTypes, setOverlayFilterActive]);

  useEffect(() => {
    if (!hasInitialized) return;

    const hasFilters =
      (selectedOverlayTypes && selectedOverlayTypes.length > 0) ||
      (selectedStates && selectedStates.length > 0) ||
      (selectedWaterSourceTypes && selectedWaterSourceTypes.length > 0);

    const shouldPersist = isOverlayFilterActive || hasFilters;

    if (!shouldPersist) {
      setParameter(undefined);
      return;
    }

    const paramValue: OverlaysUrlParams = {
      selectedOverlayTypes,
      selectedStates,
      selectedWaterSourceTypes,
      isActive: isOverlayFilterActive || undefined,
    };

    setParameter(paramValue);
  }, [
    selectedOverlayTypes,
    selectedStates,
    selectedWaterSourceTypes,
    isOverlayFilterActive,
    setParameter,
    hasInitialized,
  ]);
}
