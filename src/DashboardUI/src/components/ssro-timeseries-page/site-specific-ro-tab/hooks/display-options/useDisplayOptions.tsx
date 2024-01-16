import { useEffect } from "react";
import { useSiteSpecificContext } from "../../Provider";
import { mapLayerNames } from "../../../../../config/maps";
import { useMapContext } from "../../../../../contexts/MapProvider";
import { useMapLegend } from "./useMapLegend";
import useNldiMapPopup from "../../../../../hooks/map-popups/useNldiMapPopup";
import useSiteSpecificDigestMapPopup from "../../../../../hooks/map-popups/useSiteSpecificDigestMapPopup";
import { useAlerts } from "../useAlerts";

const allSiteSpecificLayers = [
  mapLayerNames.sitespecificROLayer
]
const nldiLayers = [
  mapLayerNames.nldiFlowlinesLayer,
  mapLayerNames.nldiUsgsLocationLayer,
  mapLayerNames.nldiUsgsPointsLayer
];
export function useDisplayOptions() {
  const {filters: {riverBasinNames, isNldiFilterActive}} = useSiteSpecificContext();

  const {
    setVisibleLayers
  } = useMapContext();

  useEffect(() => {
    let visible = [...allSiteSpecificLayers];
    if ((riverBasinNames?.length ?? 0) > 0) visible.push(mapLayerNames.riverBasinsLayer);
    if (isNldiFilterActive) visible.push(...nldiLayers);

    setVisibleLayers(visible);
  }, [riverBasinNames, isNldiFilterActive, setVisibleLayers])

  useMapLegend();

  useNldiMapPopup();
  useSiteSpecificDigestMapPopup();

  useAlerts();
}

