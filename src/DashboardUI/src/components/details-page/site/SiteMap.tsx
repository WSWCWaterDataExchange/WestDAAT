import React from 'react';
import { useMemo } from 'react';
import DetailsMap from '../DetailsMap';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import useWaterRightDigestMapPopup from '../../../hooks/map-popups/useWaterRightDigestMapPopup';
import { useSiteDetailsContext } from './Provider';
import MapProvider from '../../../contexts/MapProvider';
import { useMapLegend } from './hooks/useMapLegend';

function SiteMap() {
  return (
    <MapProvider>
      <Layout />
    </MapProvider>
  );
}

function Layout() {
  const {
    hostData: { locationsQuery },
  } = useSiteDetailsContext();

  const featureCollection = useMemo<
    FeatureCollection<Geometry, GeoJsonProperties> | undefined
  >(() => {
    if (!locationsQuery.data) return undefined;
    return {
      features: [locationsQuery.data],
      type: 'FeatureCollection',
    };
  }, [locationsQuery.data]);

  useWaterRightDigestMapPopup();
  useMapLegend();

  if (locationsQuery.isLoading || !featureCollection) return null;
  return <DetailsMap mapData={featureCollection} />;
}

export default SiteMap;
