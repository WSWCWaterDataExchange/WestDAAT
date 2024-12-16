import React from 'react';
import DetailsMap from '../DetailsMap';
import MapProvider from '../../../contexts/MapProvider';
import { useOverlayDetailsContext } from './Provider';

function OverlayMap() {
  return (
    <MapProvider>
      <Layout />
    </MapProvider>
  );
}

function Layout() {
  const {
    hostData: { geometryFeatureCollection, detailsQuery },
  } = useOverlayDetailsContext();

  if (detailsQuery.isLoading || !geometryFeatureCollection) return null;

  return <DetailsMap mapData={geometryFeatureCollection} />;
}

export default OverlayMap;
