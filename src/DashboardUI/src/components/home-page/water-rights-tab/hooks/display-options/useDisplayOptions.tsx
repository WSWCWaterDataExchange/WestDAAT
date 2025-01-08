import { useEffect } from 'react';
import { useWaterRightsContext } from '../../Provider';
import { useMapPointScaling } from './useMapPointScaling';
import { mapLayerNames } from '../../../../../config/maps';
import { useMapContext } from '../../../../../contexts/MapProvider';
import { useMapLegend } from './useMapLegend';
import useNldiMapPopup from '../../../../../hooks/map-popups/useNldiMapPopup';
import useWaterRightDigestMapPopup from '../../../../../hooks/map-popups/useWaterRightDigestMapPopup';
import { useAlerts } from '../useAlerts';

const allWaterRightsLayers = [mapLayerNames.waterRightsPointsLayer, mapLayerNames.waterRightsPolygonsLayer, mapLayerNames.overlayTypesPolygonsLayer, mapLayerNames.overlayTypesPolygonsBorderLayer];
const nldiLayers = [
  mapLayerNames.nldiFlowlinesLayer,
  mapLayerNames.nldiUsgsLocationLayer,
  mapLayerNames.nldiUsgsPointsLayer,
];
export function useDisplayOptions() {
  const {
    filters: { riverBasinNames, isNldiFilterActive },
  } = useWaterRightsContext();

  const { setVisibleLayers } = useMapContext();

  useEffect(() => {
    const visible = [...allWaterRightsLayers];
    if ((riverBasinNames?.length ?? 0) > 0) visible.push(mapLayerNames.riverBasinsLayer);
    if (isNldiFilterActive) visible.push(...nldiLayers);

    setVisibleLayers(visible);
  }, [riverBasinNames, isNldiFilterActive, setVisibleLayers]);

  useMapLegend();
  useMapPointScaling();

  useNldiMapPopup();
  useWaterRightDigestMapPopup();

  useAlerts();
}
