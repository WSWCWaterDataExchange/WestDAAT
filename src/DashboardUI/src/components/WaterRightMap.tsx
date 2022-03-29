import { useContext, useEffect } from "react";
import Map from './Map';
import { MapContext } from './MapProvider';
import mapboxgl from 'mapbox-gl';
import { useWaterRightSiteLocations } from "../hooks";
import { Position } from "geojson";

interface waterRightMapProps {
  waterRightId: string;
}

function WaterRightMap(props: waterRightMapProps) {
  const { data: waterRightSiteLocations, isFetching: isWaterRightSiteLocationsLoading } = useWaterRightSiteLocations(+props.waterRightId);

  const {
    setVisibleLayers,
    setGeoJsonData,
    setMapBoundSettings: setMapBounds
  } = useContext(MapContext);

  useEffect(() => {
    setVisibleLayers(["site-locations-points", "site-locations-polygons", "site-locations-label"]);
  }, [setVisibleLayers])

  useEffect(() => {
    if (waterRightSiteLocations) {
      setGeoJsonData("site-locations", waterRightSiteLocations);
    }
  }, [waterRightSiteLocations, setGeoJsonData])

  useEffect(() => {
    let positions: Position[] = [];
    waterRightSiteLocations?.features.forEach(x => {
      if (x.geometry.type === 'Point') {
        positions.push(x.geometry.coordinates)
      } else if (x.geometry.type === 'MultiPoint') {
        positions = positions.concat(x.geometry.coordinates)
      } else if (x.geometry.type === 'Polygon') {
        x.geometry.coordinates.forEach(y => {
          positions = positions.concat(y)
        })
      } else if (x.geometry.type === 'MultiPolygon') {
        x.geometry.coordinates.forEach(y => {
          y.forEach(z => {
            positions = positions.concat(z)
          })
        })
      }
    })

    setMapBounds({
      LngLatBounds: positions.map(a => new mapboxgl.LngLat(a[0], a[1])),
      maxZoom: 10,
      padding: 50
    })
  }, [waterRightSiteLocations, setMapBounds])

  if (isWaterRightSiteLocationsLoading) return null;

  return (
    <Map />
  )
}

export default WaterRightMap;