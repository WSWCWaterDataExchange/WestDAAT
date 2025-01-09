import { useCallback, useMemo, useState, useEffect } from 'react';
import { useWaterRightsContext } from '../../Provider';

type OverlayFilters = { [key: string]: boolean };

export function useOverlaysFilter(isOverlayFilterActive: boolean) {
  const { filters, setFilters, hostData } = useWaterRightsContext();
  const overlaysData = hostData.overlaysQuery?.data || [];

  const [overlayFilters, setOverlayFilters] = useState<OverlayFilters>(() => {
    return overlaysData.reduce((acc: OverlayFilters, overlay: string) => {
      acc[overlay] = filters.overlays?.includes(overlay) || false;
      return acc;
    }, {});
  });

  useEffect(() => {
    if (!isOverlayFilterActive) {
      setOverlayFilters({});
    } else {
      // Reinitialize filters based on overlaysData
      setOverlayFilters((prev) =>
        overlaysData.reduce((acc: OverlayFilters, overlay: string) => {
          acc[overlay] = prev[overlay] || filters.overlays?.includes(overlay) || false;
          return acc;
        }, {})
      );
    }
  }, [isOverlayFilterActive, overlaysData, filters.overlays]);

  const mapFilters = useMemo(() => {
    const activeFilters = Object.entries(overlayFilters)
      .filter(([, isChecked]) => isChecked)
      .map(([overlay]) => overlay);

    if (activeFilters.length > 0) {
      return ['any', ...activeFilters.map((overlay) => ['==', 'oType', overlay])];
    }
    return undefined;
  }, [overlayFilters]);

  const toggleOverlayFilter = useCallback(
    (overlay: string, isChecked: boolean) => {
      setOverlayFilters((prev) => ({
        ...prev,
        [overlay]: isChecked,
      }));
      setFilters((prevFilters) => ({
        ...prevFilters,
        overlays: isChecked
          ? [...(prevFilters.overlays || []), overlay]
          : (prevFilters.overlays || []).filter((o) => o !== overlay),
      }));
    },
    [setFilters],
  );

  return { overlayFilters, toggleOverlayFilter, mapFilters };
}
