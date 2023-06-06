import { useCallback, useEffect, useMemo } from "react";
import Map from "../map/Map";
import { useMapContext } from "../../contexts/MapProvider";
import mapboxgl from "mapbox-gl";
import { FeatureCollection, GeoJsonProperties, Geometry, Position,  } from "geojson";
import { mapLayerNames, mapSourceNames } from "../../config/maps";
import { MapThemeSelector } from "../map/MapThemeSelector";
import { getLatsLongsFromFeatureCollection } from "../../utilities/geometryHelpers";

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

  const handleMapFitChange = useCallback(() => {
    if(props.mapData){
      setMapBounds({
        LngLatBounds: getLatsLongsFromFeatureCollection(props.mapData),
        maxZoom: 12,
        padding: 25,
      });
    }
  }, [props.mapData, setMapBounds]);

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
