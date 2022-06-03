import { useContext, useEffect } from "react";
import Map from './Map';
import { MapContext } from './MapProvider';
import mapboxgl from 'mapbox-gl';
import { useWaterSiteLocation } from "../hooks";
import { Position } from "geojson";
import { nldi } from "../config/constants";
import Icon from "@mdi/react";
import { mdiMapMarker } from "@mdi/js";

interface siteMapProps {
  siteId: string;
}

function SiteMap(props: siteMapProps) {
  const { data: waterSiteLocation, isFetching: isWaterSiteLocationLoading } = useWaterSiteLocation(props.siteId);

  const {
    setVisibleLayers,
    setGeoJsonData,
    setMapBoundSettings: setMapBounds,
    setLegend,
  } = useContext(MapContext);

  useEffect(() => {
    setVisibleLayers(["site-locations-label", "site-locations-points", "site-locations-polygons"]);
  }, [setVisibleLayers])

  useEffect(() => {
    setLegend(<>
      <div className="legend-item">
        <Icon path={mdiMapMarker} size="48px" color={nldi.colors.sitePOD} />
        Point of Diversion (POD)
      </div>
      <div className="legend-item">
        <Icon path={mdiMapMarker} size="48px" color={nldi.colors.sitePOU} />
        Place of Use (POU)
      </div>
    </>);
  }, [setLegend])

  useEffect(() => {
    if (waterSiteLocation) {
      setGeoJsonData("site-locations", waterSiteLocation);
    }
  }, [waterSiteLocation, setGeoJsonData])

  useEffect(() => {
    let positions: Position[] = [];

    if (waterSiteLocation?.geometry.type === 'Point') {
      positions.push(waterSiteLocation?.geometry.coordinates)
    } else if (waterSiteLocation?.geometry.type === 'MultiPoint') {
      positions = positions.concat(waterSiteLocation?.geometry.coordinates)
    } else if (waterSiteLocation?.geometry.type === 'Polygon') {
      waterSiteLocation?.geometry.coordinates.forEach(y => {
        positions = positions.concat(y)
      })
    } else if (waterSiteLocation?.geometry.type === 'MultiPolygon') {
      waterSiteLocation.geometry.coordinates.forEach(y => {
        y.forEach(z => {
          positions = positions.concat(z)
        })
      })
    }

    setMapBounds({
      LngLatBounds: positions.map(a => new mapboxgl.LngLat(a[0], a[1])),
      maxZoom: 10,
      padding: 50
    })
  }, [waterSiteLocation, setMapBounds])

  if (isWaterSiteLocationLoading) return null;

  return (
    <div className="map-container h-100">
      <Map hideDrawControl={true} />
    </div>
  )
}

export default SiteMap;