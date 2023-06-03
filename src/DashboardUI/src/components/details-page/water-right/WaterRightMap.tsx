import { useContext } from "react";
import useSiteDigestMapPopup from "../../../hooks/map-popups/useSiteDigestMapPopup";
import DetailsMap from "../DetailsMap";
import { WaterRightDetailsContext } from "./Provider";
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
  const {hostData: {siteLocationsQuery}} = useContext(WaterRightDetailsContext);
  
  useSiteDigestMapPopup();
  useMapLegend();

  return (
    <DetailsMap isDataLoading={siteLocationsQuery.isLoading} mapData={siteLocationsQuery.data} />
  );
}

export default WaterRightMap;
