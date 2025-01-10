// /hooks/filters/useOverlaysFilter.ts
import { useCallback, useMemo, useEffect } from 'react';
import { useWaterRightsContext } from '../../Provider';

export function useOverlaysFilter() {
  const { filters, setFilters, hostData } = useWaterRightsContext();
  const { data: overlaysData } = hostData.overlaysQuery ?? {};

  const isOverlayFilterActive = filters.isOverlayFilterActive ?? false;
  const overlays = filters.overlays ?? [];

  // Main toggle for overlay on/off
  const setOverlayFilterActive = useCallback((active: boolean) => {
    setFilters((prev) => ({
      ...prev,
      isOverlayFilterActive: active,
    }));
  }, [setFilters]);

  // Individual toggles for each overlay type
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

  // Default sub-toggles to on if empty
  useEffect(() => {
    if (overlaysData?.length && overlays.length === 0) {
      setFilters((prev) => ({
        ...prev,
        overlays: overlaysData.slice(),
      }));
    }
  }, [overlaysData, overlays, setFilters]);

  /**
   * Build a filter expression for polygons that store `oType` as a JSON array
   * We'll create an "any" expression so if a polygon has any toggled type, it shows.
   */
  const mapFilters = useMemo(() => {
    if (!isOverlayFilterActive || overlays.length === 0) {
      return null;
    }
    // For each toggled overlay, create ["in", overlayKey, ["get","oType"]]
    const exprs = overlays.map((key) => ["in", key, ["get", "oType"]]);
    // Combine them with "any" so it shows if the polygon has ANY matching sub-type
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
