/*
This file is largely duped from other existing maps in site and water rights pages. Potential opportunity to create a more reusable component for this.
 */

import { useEffect } from "react";
import { useMapContext } from "../../../../contexts/MapProvider";
import { nldi } from "../../../../config/constants";
import { MapLegendMarkerItem } from "../../../map/MapLegendItem";
import {
  mapLayerNames,
  siteLocationPointsIconImage,
  siteLocationPolygonFillColor,
} from "../../../../config/maps";

const defaultPolygonFillColors = {
  layer: mapLayerNames.siteLocationsPolygonsLayer,
  fillColor: siteLocationPolygonFillColor,
};
const defaultMapMarkerIcons = {
  layer: mapLayerNames.siteLocationsPointsLayer,
  iconImages: siteLocationPointsIconImage,
};

export function useMapLegend() {
  const { setLegend, setLayerFillColors, setLayerIconImages } = useMapContext();

  useEffect(() => {
    setLegend(<></>);
    setLayerFillColors(defaultPolygonFillColors);
    setLayerIconImages(defaultMapMarkerIcons);
  }, [setLegend, setLayerFillColors, setLayerIconImages]);
}
