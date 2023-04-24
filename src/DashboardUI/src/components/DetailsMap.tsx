import { useContext, useEffect } from "react";
import Map from "./Map";
import { MapContext, MapStyle } from "./MapProvider";
import mapboxgl from "mapbox-gl";
import { FeatureCollection, GeoJsonProperties, Geometry, Position,  } from "geojson";
import { nldi } from "../config/constants";
import Icon from "@mdi/react";
import { mdiMapMarker } from "@mdi/js";
import { useWaterRightsMapPopup } from "../hooks/useWaterRightsMapPopup";

interface detailsMapProps {
  isDataLoading: boolean;
  mapData: FeatureCollection<Geometry, GeoJsonProperties> | undefined;
}

function DetailsMap(props: detailsMapProps) {
  const {
    setVisibleLayers,
    setGeoJsonData,
    setMapBoundSettings: setMapBounds,
    setLegend,
    setMapStyle,
  } = useContext(MapContext);

  useEffect(() => {
    setVisibleLayers([
      "site-locations-label",
      "site-locations-points",
      "site-locations-polygons",
    ]);
  }, [setVisibleLayers]);

  useEffect(() => {
    setMapStyle(MapStyle.Satellite);
  }, [setMapStyle]);

  useEffect(() => {
    setLegend(
      <>
        <div className="legend-item">
          <Icon path={mdiMapMarker} size="48px" color={nldi.colors.sitePOD} />
          Point of Diversion (POD)
        </div>
        <div className="legend-item">
          <Icon path={mdiMapMarker} size="48px" color={nldi.colors.sitePOU} />
          Place of Use (POU)
        </div>
      </>
    );
  }, [setLegend]);

  useEffect(() => {
    if (props.mapData) {
      setGeoJsonData("site-locations", props.mapData);
    }
  }, [props.mapData, setGeoJsonData]);

  useEffect(() => {
    let positions: Position[] = [];
    
    props.mapData?.features.forEach((x) => {
      if (x.geometry.type === "Point") {
        positions.push(x.geometry.coordinates);
      } else if (x.geometry.type === "MultiPoint") {
        positions = positions.concat(x.geometry.coordinates);
      } else if (x.geometry.type === "Polygon") {
        x.geometry.coordinates.forEach((y) => {
          positions = positions.concat(y);
        });
      } else if (x.geometry.type === "MultiPolygon") {
        x.geometry.coordinates.forEach((y) => {
          y.forEach((z) => {
            positions = positions.concat(z);
          });
        });
      }
    });

    setMapBounds({
      LngLatBounds: positions.map((a) => new mapboxgl.LngLat(a[0], a[1])),
      maxZoom: 18,
      padding: 50,
    });
  }, [props.mapData, setMapBounds]);

  useWaterRightsMapPopup();

  if (props.isDataLoading) return null;

  return (
    <div className="map-container h-100">
      <Map hideDrawControl={true} />
    </div>
  );
}

export default DetailsMap;
