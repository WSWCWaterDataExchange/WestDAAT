import { useEffect, useMemo } from 'react';
import { useOverlaysContext } from '../../OverlaysProvider';

export function useOverlaysFilter() {
  const {
    visibleOverlayTypes,
    selectedOverlayTypes,
    selectedStates,
    selectedWaterSourceTypes,
    isOverlayFilterActive,
    setOverlayFilterActive,
    setSelectedOverlayTypes,
    setStates,
    setWaterSourceTypes,
    resetOverlaysOptions,
  } = useOverlaysContext();

  useEffect(() => {
    if (!isOverlayFilterActive) {
      return;
    }
  }, [isOverlayFilterActive]);

  const overlayTypeFilters = useMemo(() => {
    if (!isOverlayFilterActive || !visibleOverlayTypes || visibleOverlayTypes.length === 0) return null;
    return ['any', ...visibleOverlayTypes.map((type) => ['in', type, ['get', 'oType']])];
  }, [isOverlayFilterActive, visibleOverlayTypes]);

  const stateFilters = useMemo(() => {
    if (!isOverlayFilterActive || !selectedStates || selectedStates.length === 0) return null;
    return ['any', ...selectedStates.map((state) => ['==', ['get', 'state'], state])];
  }, [isOverlayFilterActive, selectedStates]);

  const waterSourceFilters = useMemo(() => {
    if (!isOverlayFilterActive || !selectedWaterSourceTypes || selectedWaterSourceTypes.length === 0) return null;
    return ['any', ...selectedWaterSourceTypes.map((type) => ['in', type, ['get', 'wsType']])];
  }, [isOverlayFilterActive, selectedWaterSourceTypes]);

  const combinedFilters = useMemo(() => {
    if (!isOverlayFilterActive) return null;

    const filters: any[] = ['all'];
    if (overlayTypeFilters) filters.push(overlayTypeFilters);
    if (stateFilters) filters.push(stateFilters);
    if (waterSourceFilters) filters.push(waterSourceFilters);

    return filters.length > 1 ? filters : null;
  }, [isOverlayFilterActive, overlayTypeFilters, stateFilters, waterSourceFilters]);

  return {
    isOverlayFilterActive,
    setOverlayFilterActive,
    visibleOverlayTypes,
    selectedOverlayTypes,
    selectedStates,
    selectedWaterSourceTypes,
    setSelectedOverlayTypes,
    setStates,
    setWaterSourceTypes,
    resetOverlaysOptions,
    mapFilters: combinedFilters,
  };
}
