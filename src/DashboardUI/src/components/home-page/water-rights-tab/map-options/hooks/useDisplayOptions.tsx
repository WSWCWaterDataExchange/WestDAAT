import { useEffect } from 'react';
import { useWaterRightsContext } from '../../sidebar-filtering/WaterRightsProvider'; // only for water-rights filters
import { useOverlaysContext } from '../../sidebar-filtering/OverlaysProvider'; // new
import { mapLayerNames } from '../../../../../config/maps';
import { useMapContext } from '../../../../../contexts/MapProvider';
import { useMapLegend } from './useMapLegend';
import { useMapPointScaling } from './useMapPointScaling';
import useNldiMapPopup from '../../../../../hooks/map-popups/useNldiMapPopup';
import useWaterRightDigestMapPopup from '../../../../../hooks/map-popups/useWaterRightDigestMapPopup';
import useOverlayDigestMapPopup from '../../../../../hooks/map-popups/useOverlayDigestMapPopup';
import { useAlerts } from '../../useAlerts';
import useSiteClickedOnMap from '../../../../../hooks/map-popups/useSiteClickedOnMap';

const baseLayers = [
  mapLayerNames.waterRightsPointsLayer,
  mapLayerNames.waterRightsPolygonsLayer,
];

const nldiLayers = [
  mapLayerNames.nldiFlowlinesLayer,
  mapLayerNames.nldiUsgsLocationLayer,
  mapLayerNames.nldiUsgsPointsLayer,
];
const overlayLayers = [
  mapLayerNames.overlayTypesPolygonsLayer,
  mapLayerNames.overlayTypesPolygonsBorderLayer,
];

const timeSeriesLayers = [
  mapLayerNames.timeSeriesPointsLayer,
  mapLayerNames.timeSeriesPolygonsLayer
];

export function useDisplayOptions() {
  const {
    filters: { riverBasinNames, isNldiFilterActive },
  } = useWaterRightsContext();

  const { isOverlayFilterActive } = useOverlaysContext();

  const { setVisibleLayers } = useMapContext();

  useEffect(() => {
    const visible = [...baseLayers];

    if ((riverBasinNames?.length ?? 0) > 0) {
      visible.push(mapLayerNames.riverBasinsLayer);
    }

    if (isNldiFilterActive) {
      visible.push(...nldiLayers);
    }

    if (isOverlayFilterActive) {
      visible.push(...overlayLayers);
    }

    visible.push(...timeSeriesLayers);

    setVisibleLayers(visible);
  }, [riverBasinNames, isNldiFilterActive, isOverlayFilterActive, setVisibleLayers]);

  useMapLegend();
  useMapPointScaling();
  useNldiMapPopup();
  useOverlayDigestMapPopup();
  useWaterRightDigestMapPopup();
  useAlerts();
}
