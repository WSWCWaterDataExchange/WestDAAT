import { useContext, useEffect } from "react";
import Map from './Map';
import { MapContext, MapStyle } from './MapProvider';
import mapboxgl from 'mapbox-gl';
import { useWaterRightSiteLocations } from "../hooks";
import { Position } from "geojson";
import { nldi } from "../config/constants";
import Icon from "@mdi/react";
import { mdiMapMarker } from "@mdi/js";

interface waterRightMapProps {
  allocationUuid: string;
}

function WaterRightMap(props: waterRightMapProps) {
  const { data: waterRightSiteLocations, isFetching: isWaterRightSiteLocationsLoading } = useWaterRightSiteLocations(props.allocationUuid);

  const {
    setVisibleLayers,
    setGeoJsonData,
    setMapBoundSettings: setMapBounds,
    setLegend,
    setMapStyle
  } = useContext(MapContext);

  useEffect(() => {
    setVisibleLayers(["site-locations-label", "site-locations-points", "site-locations-polygons"]);
  }, [setVisibleLayers])

  useEffect(() => {
    setMapStyle(MapStyle.Satellite);
  }, [setMapStyle])

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
    <div className="map-container h-100">
      <Map hideDrawControl={true} />
    </div>
  )
}

export default WaterRightMap;