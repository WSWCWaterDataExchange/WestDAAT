import { useEffect, useMemo } from 'react';
import { useMapContext } from '../../../../contexts/MapProvider';
import { mapLayerNames } from '../../../../config/maps';
import { useOverlaysFilter } from './overlays/hooks/useOverlaysFilter';
import { useWaterRightsFilter } from './water-rights/hooks/useWaterRightsFilter';
import { useTimeSeriesFilter } from './time-series/hooks/useTimeSeriesFilter';

export function useFilters() {
  const { setLayerFilters } = useMapContext();

  const waterRightsFilters = useWaterRightsFilter();
  const { mapFilters: overlaysMapFilters } = useOverlaysFilter();
  const { mapFilters: timeSeriesMapFilters } = useTimeSeriesFilter();
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
      {
        layer: mapLayerNames.timeSeriesPointsLayer,
        filter: timeSeriesMapFilters,
      },
      // if you have timeSeries polygons, add them:
      // { layer: mapLayerNames.timeSeriesPolygonsLayer, filter: timeSeriesMapFilters },
    ]);
  }, [allMapFilters, overlaysMapFilters, timeSeriesMapFilters, setLayerFilters]);
}
