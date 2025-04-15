import { useEffect } from 'react';
import { useWaterRightsContext } from '../../sidebar-filtering/WaterRightsProvider';
import { useOverlaysContext } from '../../sidebar-filtering/OverlaysProvider';
import { mapLayerNames } from '../../../../../config/maps';
import { useMapContext } from '../../../../../contexts/MapProvider';
import { useMapLegend } from './useMapLegend';
import { useMapPointScaling } from './useMapPointScaling';
import useMultiFeatureMapPopup from '../../../../../hooks/map-popups/useMultiFeatureMapPopup'; // new aggregator hook
import { useAlerts } from '../../useAlerts';
import { useTimeSeriesFilter } from '../../sidebar-filtering/time-series/hooks/useTimeSeriesFilter';

const baseLayers = [
  mapLayerNames.waterRightsPointsLayer,
  mapLayerNames.waterRightsPolygonsLayer,
];

const overlayLayers = [
  mapLayerNames.overlayTypesPolygonsLayer,
  mapLayerNames.overlayTypesPolygonsBorderLayer,
];

const timeSeriesLayers = [
  mapLayerNames.timeSeriesPointsLayer,
  mapLayerNames.timeSeriesPolygonsLayer,
];

export function useDisplayOptions() {
  const {
    filters: { riverBasinNames, isNldiFilterActive, isWaterRightsFilterActive },
  } = useWaterRightsContext();
  const { isOverlayFilterActive } = useOverlaysContext();
  const { isTimeSeriesFilterActive } = useTimeSeriesFilter();
  const { setVisibleLayers } = useMapContext();

  useEffect(() => {
    const visible: string[] = [];

    if (isWaterRightsFilterActive) {
      visible.push(...baseLayers);
    }

    if ((riverBasinNames?.length ?? 0) > 0) {
      visible.push(mapLayerNames.riverBasinsLayer);
    }

    if (isOverlayFilterActive) {
      visible.push(...overlayLayers);
    }

    if (isTimeSeriesFilterActive) {
      visible.push(...timeSeriesLayers);
    }

    setVisibleLayers(visible);
  }, [
    riverBasinNames,
    isNldiFilterActive,
    isWaterRightsFilterActive,
    isOverlayFilterActive,
    isTimeSeriesFilterActive,
    setVisibleLayers,
  ]);

  useMapLegend();
  useMapPointScaling();

  useMultiFeatureMapPopup();

  useAlerts();
}
