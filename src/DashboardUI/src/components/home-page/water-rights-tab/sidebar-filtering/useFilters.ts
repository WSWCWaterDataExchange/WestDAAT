import { useEffect, useMemo } from 'react';
import { useMapContext } from '../../../../contexts/MapProvider';
import { mapLayerNames } from '../../../../config/maps';
import { useOverlaysFilter } from './overlays/hooks/useOverlaysFilter';
import { useWaterRightsFilter } from "./water-rights/hooks/useWaterRightsFilter";

export function useFilters() {
  const { setLayerFilters } = useMapContext();
  const waterRightsFilters = useWaterRightsFilter();
  const { mapFilters: overlaysMapFilters } = useOverlaysFilter();

  const allMapFilters = useMemo(() => ['all', ...waterRightsFilters], [waterRightsFilters]);

  useEffect(() => {
    setLayerFilters([
      {
        layer: mapLayerNames.waterRightsPointsLayer,
        filter: allMapFilters,
      },
      {
        layer: mapLayerNames.waterRightsPolygonsLayer,
        filter: allMapFilters,
      },
      {
        layer: mapLayerNames.overlayTypesPolygonsLayer,
        filter: overlaysMapFilters,
      },
    ]);
  }, [allMapFilters, overlaysMapFilters, setLayerFilters]);
}
