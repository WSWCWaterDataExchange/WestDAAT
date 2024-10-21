import React from 'react';
import useSiteDigestMapPopup from "../../../hooks/map-popups/useSiteDigestMapPopup";
import DetailsMap from "../DetailsMap";
import { useWaterRightDetailsContext } from "./Provider";
import MapProvider from "../../../contexts/MapProvider";
import { useMapLegend } from "./hooks/useMapLegend";

function WaterRightMap() {
  return (
    <MapProvider>
      <Layout />
    </MapProvider>
  );
}

function Layout() {
  const {hostData: {siteLocationsQuery}} = useWaterRightDetailsContext();
  
  useSiteDigestMapPopup();
  useMapLegend();

  if (siteLocationsQuery.isLoading || !siteLocationsQuery.data) return null;
  return <DetailsMap mapData={siteLocationsQuery.data} />;
}

export default WaterRightMap;
