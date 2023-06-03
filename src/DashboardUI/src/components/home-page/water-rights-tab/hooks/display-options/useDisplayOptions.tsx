import { useContext, useEffect } from "react";
import { WaterRightsContext } from "../../Provider";
import { useMapPointScaling } from "./useMapPointScaling";
import { mapLayerNames } from "../../../../../config/maps";
import { MapContext } from "../../../../../contexts/MapProvider";
import { useMapLegend } from "./useMapLegend";
import useNldiMapPopup from "../../../../../hooks/map-popups/useNldiMapPopup";
import useWaterRightDigestMapPopup from "../../../../../hooks/map-popups/useWaterRightDigestMapPopup";
import { useAlerts } from "../useAlerts";

const allWaterRightsLayers = [
  mapLayerNames.waterRightsPointsLayer,
  mapLayerNames.waterRightsPolygonsLayer
]
const nldiLayers = [
  mapLayerNames.nldiFlowlinesLayer,
  mapLayerNames.nldiUsgsLocationLayer,
  mapLayerNames.nldiUsgsPointsLayer
];
export function useDisplayOptions() {
  const {filters: {riverBasinNames, isNldiFilterActive}} = useContext(WaterRightsContext);

  const {
    setVisibleLayers
  } = useContext(MapContext);

  useEffect(() => {
    let visible = [...allWaterRightsLayers];
    if ((riverBasinNames?.length ?? 0) > 0) visible.push(mapLayerNames.riverBasinsLayer);
    if (isNldiFilterActive) visible.push(...nldiLayers);

    setVisibleLayers(visible);
  }, [riverBasinNames, isNldiFilterActive, setVisibleLayers])

  useMapLegend();
  useMapPointScaling();

  useNldiMapPopup();
  useWaterRightDigestMapPopup();

  useAlerts();
}

