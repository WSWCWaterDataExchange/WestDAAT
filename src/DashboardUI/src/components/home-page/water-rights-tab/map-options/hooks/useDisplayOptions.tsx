import { useEffect } from 'react';
import { useWaterRightsContext } from '../../sidebar-filtering/Provider';
import { useMapPointScaling } from './useMapPointScaling';
import { mapLayerNames } from '../../../../../config/maps';
import { useMapContext } from '../../../../../contexts/MapProvider';
import { useMapLegend } from './useMapLegend';
import useNldiMapPopup from '../../../../../hooks/map-popups/useNldiMapPopup';
import useWaterRightDigestMapPopup from '../../../../../hooks/map-popups/useWaterRightDigestMapPopup';
import { useAlerts } from '../../useAlerts';
import useOverlayDigestMapPopup from '../../../../../hooks/map-popups/useOverlayDigestMapPopup';
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

export function useDisplayOptions() {
  const {
    filters: { riverBasinNames, isNldiFilterActive, isOverlayFilterActive },
  } = useWaterRightsContext();
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

    setVisibleLayers(visible);
  }, [riverBasinNames, isNldiFilterActive, isOverlayFilterActive, setVisibleLayers]);

  useMapLegend();
  useMapPointScaling();
  useNldiMapPopup();
  useOverlayDigestMapPopup();
  useWaterRightDigestMapPopup();
  useAlerts();
}
