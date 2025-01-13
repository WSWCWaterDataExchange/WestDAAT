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

  useEffect(() => {
    if (overlaysData?.length && overlays.length === 0) {
      setFilters((prev) => ({
        ...prev,
        overlays: overlaysData.slice(),
      }));
    }
  }, [overlaysData, overlays, setFilters]);

  const mapFilters = useMemo(() => {
    if (!isOverlayFilterActive || overlays.length === 0) {
      return null;
    }
    const exprs = overlays.map((key) => ["in", key, ["get", "oType"]]);
    return ["any", ...exprs];
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
