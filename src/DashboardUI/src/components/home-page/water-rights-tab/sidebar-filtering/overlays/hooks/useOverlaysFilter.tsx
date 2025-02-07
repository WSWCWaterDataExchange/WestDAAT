import { useEffect } from 'react';
import { useOverlaysContext } from '../../OverlaysProvider';

export function useOverlaysFilter() {
  const {
    overlays,
    isOverlayFilterActive,
    setOverlayFilterActive,
    toggleOverlay,
    overlaysData,
    resetOverlaysOptions,
    mapFilters,
  } = useOverlaysContext();

  useEffect(() => {}, [overlaysData, overlays]);

  return {
    isOverlayFilterActive,
    setOverlayFilterActive,
    overlaysData,
    overlays,
    toggleOverlay,
    resetOverlaysOptions,
    mapFilters,
  };
}
