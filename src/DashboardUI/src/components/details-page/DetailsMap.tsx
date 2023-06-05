import { useCallback, useEffect, useMemo } from "react";
import Map from "../map/Map";
import { useMapContext } from "../../contexts/MapProvider";
import mapboxgl from "mapbox-gl";
import { FeatureCollection, GeoJsonProperties, Geometry, Position,  } from "geojson";
import { mapLayerNames, mapSourceNames } from "../../config/maps";
import { MapThemeSelector } from "../map/MapThemeSelector";

interface detailsMapProps {
  mapData: FeatureCollection<Geometry, GeoJsonProperties>;
}

function DetailsMap(props: detailsMapProps) {
  const {
    setVisibleLayers,
    setGeoJsonData,
    setMapBoundSettings: setMapBounds,
  } = useMapContext();

  useEffect(() => {
    setVisibleLayers([
      mapLayerNames.siteLocationsPointsLayer,
      mapLayerNames.siteLocationsPolygonsLayer,
    ]);
  }, [setVisibleLayers]);

  useEffect(() => {
    setGeoJsonData(mapSourceNames.detailsMapGeoJson, props.mapData);
  }, [props.mapData, setGeoJsonData]);

  const mapBounds = useMemo(() => {
    let positions: Position[] = [];
    
    props.mapData.features.forEach((x) => {
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

    return positions;
  }, [props.mapData]);

  const handleMapFitChange = useCallback(() => {
    setMapBounds({
      LngLatBounds: mapBounds.map((a) => new mapboxgl.LngLat(a[0], a[1])),
      maxZoom: 18,
      padding: 50,
    });
  }, [mapBounds, setMapBounds]);

  useEffect(() => {
    handleMapFitChange();
  }, [handleMapFitChange]);

  return (
    <div className="map-group h-100">
      <div className="map-container h-100">
        <Map handleMapFitChange={handleMapFitChange} />
      </div>
      <div className="theme-selector-container py-3">
        <MapThemeSelector />
      </div>
    </div>
  );
}

export default DetailsMap;
