import React from 'react';
import DetailsMap from '../DetailsMap';
import MapProvider from '../../../contexts/MapProvider';
import { useOverlayDetailsContext } from './Provider';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';

function OverlayMap() {
  return (
    <MapProvider>
      <Layout />
    </MapProvider>
  );
}

function Layout() {
  const {
    hostData: { geometryFeature, detailsQuery },
  } = useOverlayDetailsContext();

  if (detailsQuery.isLoading || !geometryFeature) return null;

  const featureCollection: FeatureCollection<Geometry, GeoJsonProperties> = {
    type: 'FeatureCollection',
    features: [geometryFeature],
  };

  return <DetailsMap mapData={featureCollection} />;
}

export default OverlayMap;
