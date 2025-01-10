// /hooks/filters/useOverlaysFilter.ts
import { useCallback, useMemo, useEffect } from 'react';
import { useWaterRightsContext } from '../../Provider';

export function useOverlaysFilter() {
  const { filters, setFilters, hostData } = useWaterRightsContext();
  const { data: overlaysData } = hostData.overlaysQuery ?? {};

  const isOverlayFilterActive = filters.isOverlayFilterActive ?? false;
  const overlays = filters.overlays ?? [];

  const setOverlayFilterActive = useCallback((active: boolean) => {
    setFilters((prev) => ({
      ...prev,
      isOverlayFilterActive: active,
    }));
  }, [setFilters]);

  const toggleOverlay = useCallback((overlayKey: string, enable: boolean) => {
    setFilters((prev) => {
      const current = prev.overlays ?? [];
      let updated: string[];
      if (enable) {
        updated = current.includes(overlayKey) ? current : [...current, overlayKey];
      } else {
        updated = current.filter((o) => o !== overlayKey);
      }
      return { ...prev, overlays: updated };
    });
  }, [setFilters]);

  // On first load, if overlaysData is available and overlays is empty, set them all to ON
  // so that by default each overlay toggle is "true" (but invisible if main toggle is off)
  useEffect(() => {
    if (overlaysData?.length && overlays.length === 0) {
      setFilters((prev) => ({
        ...prev,
        overlays: overlaysData.slice(), // copy all overlay keys
      }));
    }
  }, [overlaysData, overlays, setFilters]);

  const mapFilters = useMemo(() => {
    if (!isOverlayFilterActive || overlays.length === 0) {
      return null; // show nothing
    }
    return ['in', 'oType', ...overlays];
  }, [isOverlayFilterActive, overlays]);

  return {
    isOverlayFilterActive,
    setOverlayFilterActive,
    overlaysData,
    overlays,
    toggleOverlay,
    mapFilters,
  };
}
