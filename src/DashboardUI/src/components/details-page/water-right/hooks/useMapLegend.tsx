import React, { JSX } from 'react';
import { useEffect, useMemo } from 'react';
import { useMapContext } from '../../../../contexts/MapProvider';
import { useWaterRightDetailsContext } from '../Provider';
import { Feature, GeoJsonProperties, Geometry } from 'geojson';
import { colorList, nldi } from '../../../../config/constants';
import { MapLegendMarkerItem } from '../../../map/MapLegendItem';
import { mapLayerNames, siteLocationPointsIconImage, siteLocationPolygonFillColor } from '../../../../config/maps';
import { useColorMappings } from '../../../../hooks/useColorMappings';

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

  const {
    hostData: {
      siteLocationsQuery: { data: siteLocations },
    },
  } = useWaterRightDetailsContext();

  const sites = useMemo(() => {
    const buildMapLegend = (feature: Feature<Geometry, GeoJsonProperties>) => {
      if (!feature.properties) return undefined;
      const { uuid, podOrPou } = feature.properties;
      if (uuid && typeof uuid === 'string') {
        return { uuid, podOrPou };
      }
    };
    return (
      (siteLocations?.features.map(buildMapLegend).filter((a) => !!a) as {
        uuid: string;
        podOrPou?: string;
      }[]) || []
    );
  }, [siteLocations]);

  const { fallbackColor, getColorByIndex } = useColorMappings();

  useEffect(() => {
    if (sites.length === 0) {
      setLegend(null);
      setLayerFillColors(defaultPolygonFillColors);
      setLayerIconImages(defaultMapMarkerIcons);
      return;
    }
    if (sites.length > colorList.length) {
      setLegend(
        <>
          <MapLegendMarkerItem color={nldi.colors.sitePOD}>Point of Diversion (POD)</MapLegendMarkerItem>
          <MapLegendMarkerItem color={nldi.colors.sitePOU}>Place of Use (POU)</MapLegendMarkerItem>
        </>,
      );
      setLayerFillColors(defaultPolygonFillColors);
      setLayerIconImages(defaultMapMarkerIcons);
      return;
    }

    const buildLegendString = (uuid: string, podOrPou?: string) => {
      const typeString = podOrPou ? ` (${podOrPou})` : '';
      return `${uuid}${typeString}`;
    };

    const legendItems: JSX.Element[] = [];
    const fillColor: any[] = ['case'];
    const markerIcons: any[] = ['case'];
    sites.forEach((a, i) => {
      const color = getColorByIndex(i);

      legendItems.push(
        <MapLegendMarkerItem key={a.uuid} color={color}>
          {buildLegendString(a.uuid, a.podOrPou)}
        </MapLegendMarkerItem>,
      );

      const mapPropertyLookup = ['==', ['get', 'uuid'], a.uuid];
      fillColor.push(mapPropertyLookup);
      fillColor.push(color);

      markerIcons.push(mapPropertyLookup);
      markerIcons.push(`mapMarker${color}`);
    });
    fillColor.push(fallbackColor);
    markerIcons.push(`mapMarker${fallbackColor}`);
    setLegend(<>{legendItems}</>);
    setLayerFillColors({
      layer: defaultPolygonFillColors.layer,
      fillColor: fillColor,
    });
    setLayerIconImages({
      layer: defaultMapMarkerIcons.layer,
      iconImages: markerIcons,
    });
  }, [sites, fallbackColor, setLegend, setLayerFillColors, getColorByIndex, setLayerIconImages]);
}
