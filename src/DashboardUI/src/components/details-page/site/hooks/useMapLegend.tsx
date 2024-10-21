import React from 'react';
import { useEffect } from "react";
import { useMapContext } from "../../../../contexts/MapProvider";
import { nldi } from "../../../../config/constants";
import { MapLegendMarkerItem } from "../../../map/MapLegendItem";
import { mapLayerNames, siteLocationPointsIconImage, siteLocationPolygonFillColor } from "../../../../config/maps";

const defaultPolygonFillColors = {layer: mapLayerNames.siteLocationsPolygonsLayer, fillColor: siteLocationPolygonFillColor};
const defaultMapMarkerIcons = {layer: mapLayerNames.siteLocationsPointsLayer, iconImages: siteLocationPointsIconImage};
export function useMapLegend() {
    const {
      setLegend,
      setLayerFillColors,
      setLayerIconImages
    } = useMapContext();

    useEffect(() => {
      setLegend(<>
        <MapLegendMarkerItem color={nldi.colors.sitePOD}>Point of Diversion (POD)</MapLegendMarkerItem>
        <MapLegendMarkerItem color={nldi.colors.sitePOU}>Place of Use (POU)</MapLegendMarkerItem>
      </>)
      setLayerFillColors(defaultPolygonFillColors);
      setLayerIconImages(defaultMapMarkerIcons);
    }, [setLegend, setLayerFillColors, setLayerIconImages])

}