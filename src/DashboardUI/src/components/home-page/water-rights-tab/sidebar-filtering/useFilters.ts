import { useEffect, useMemo } from 'react';
import { useMapContext } from '../../../../contexts/MapProvider';
import { mapLayerNames } from '../../../../config/maps';
import { useOverlaysFilter } from './overlays/hooks/useOverlaysFilter';
import { useWaterRightsFilter } from './water-rights/hooks/useWaterRightsFilter';
import { useTimeSeriesFilter } from './time-series/hooks/useTimeSeriesFilter';

export function useFilters() {
  const { setLayerFilters, drawPolygon } = useMapContext();

  const { mapFilters: waterRightsMapFilters } = useWaterRightsFilter();
  const { mapFilters: overlaysMapFilters } = useOverlaysFilter();
  const { mapFilters: timeSeriesMapFilters } = useTimeSeriesFilter();

  const drawPolygonFilter = useMemo(() => {
    if (!drawPolygon) return null;
    return ['within', drawPolygon.geometry] as mapboxgl.FilterSpecification;
  }, [drawPolygon]);

  const combinedWaterRightsFilter = useMemo(() => {
    const filters = [waterRightsMapFilters, drawPolygonFilter].filter(Boolean);
    if (filters.length === 0) return null;
    if (filters.length === 1) return filters[0];
    return ['all', ...filters];
  }, [waterRightsMapFilters, drawPolygonFilter]);

  const combinedTimeSeriesFilter = useMemo(() => {
    const filters = [timeSeriesMapFilters, drawPolygonFilter].filter(Boolean);
    if (filters.length === 0) return null;
    if (filters.length === 1) return filters[0];
    return ['all', ...filters];
  }, [timeSeriesMapFilters, drawPolygonFilter]);

  useEffect(() => {
    setLayerFilters([
      {
        layer: mapLayerNames.waterRightsPointsLayer,
        filter: combinedWaterRightsFilter,
      },
      {
        layer: mapLayerNames.waterRightsPolygonsLayer,
        filter: combinedWaterRightsFilter,
      },
      {
        layer: mapLayerNames.overlayTypesPolygonsLayer,
        filter: overlaysMapFilters,
      },
      {
        layer: mapLayerNames.timeSeriesPointsLayer,
        filter: combinedTimeSeriesFilter,
      },
    ]);
  }, [combinedWaterRightsFilter, overlaysMapFilters, combinedTimeSeriesFilter, setLayerFilters]);
}
