import React from 'react';
import { useCallback, useEffect } from 'react';
import Map from '../map/Map';
import { useMapContext } from '../../contexts/MapProvider';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { mapLayerNames, mapSourceNames } from '../../config/maps';
import { MapThemeSelector } from '../map/MapThemeSelector';
import { getLatsLongsFromFeatureCollection } from '../../utilities/geometryHelpers';

interface detailsMapProps {
  mapData: FeatureCollection<Geometry, GeoJsonProperties>;
}

function DetailsMap(props: detailsMapProps) {
  const { setVisibleLayers, setGeoJsonData, setMapBoundSettings: setMapBounds } = useMapContext();

  useEffect(() => {
    setVisibleLayers([mapLayerNames.siteLocationsPointsLayer, mapLayerNames.siteLocationsPolygonsLayer]);
  }, [setVisibleLayers]);

  useEffect(() => {
    setGeoJsonData(mapSourceNames.detailsMapGeoJson, props.mapData);
  }, [props.mapData, setGeoJsonData]);

  const handleMapFitChange = useCallback(() => {
    if (props.mapData) {
      setMapBounds({
        LngLatBounds: getLatsLongsFromFeatureCollection(props.mapData),
        maxZoom: 16,
        padding: 25,
      });
    }
  }, [props.mapData, setMapBounds]);

  useEffect(() => {
    handleMapFitChange();
  }, [handleMapFitChange]);

  return (
    <div className="map-group h-100">
      <div className="map-container">
        <Map handleMapFitChange={handleMapFitChange} consumptiveUseAlertEnabled={false} geocoderEnabled={true} />
      </div>
      <div className="theme-selector-container pt-3 ps-3">
        <MapThemeSelector />
      </div>
    </div>
  );
}

export default DetailsMap;
