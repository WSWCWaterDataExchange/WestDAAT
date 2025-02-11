import { useMemo } from 'react';
import { useOverlaysContext } from '../../OverlaysProvider';

export function useOverlaysFilter() {
  const {
    selectedOverlayTypes,
    selectedStates,
    selectedWaterSourceTypes,
    isOverlayFilterActive,
    setOverlayFilterActive,
    setOverlayTypes,
    setStates,
    setWaterSourceTypes,
    resetOverlaysOptions,
  } = useOverlaysContext();

  const overlayTypeFilters = useMemo(() => {
    if (!selectedOverlayTypes || selectedOverlayTypes.length === 0) return null;
    return ['any', ...selectedOverlayTypes.map((type) => ['in', type, ['get', 'oType']])];
  }, [selectedOverlayTypes]);

  const stateFilters = useMemo(() => {
    if (!selectedStates || selectedStates.length === 0) return null;
    return ['any', ...selectedStates.map((state) => ['==', ['get', 'state'], state])];
  }, [selectedStates]);

  const waterSourceFilters = useMemo(() => {
    if (!selectedWaterSourceTypes || selectedWaterSourceTypes.length === 0) return null;
    return ['any', ...selectedWaterSourceTypes.map((type) => ['in', type, ['get', 'wsType']])];
  }, [selectedWaterSourceTypes]);

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
    selectedOverlayTypes,
    selectedStates,
    selectedWaterSourceTypes,
    setOverlayTypes,
    setStates,
    setWaterSourceTypes,
    resetOverlaysOptions,
    mapFilters: combinedFilters,
  };
}
