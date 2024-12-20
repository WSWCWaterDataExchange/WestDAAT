import React from 'react';
import DetailsMap from '../DetailsMap';
import MapProvider from '../../../contexts/MapProvider';
import {useOverlayDetailsContext} from './Provider';

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

  return <DetailsMap mapData={geometryFeature} />;
}

export default OverlayMap;
