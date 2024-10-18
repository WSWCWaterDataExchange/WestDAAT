import useSiteDigestMapPopup from "../../../hooks/map-popups/useSiteDigestMapPopup";
import DetailsMap from "../DetailsMap";
import { useRegulationDetailsContext } from "./Provider";
import MapProvider from "../../../contexts/MapProvider";
import { useMapLegend } from "./hooks/useMapLegend";

function RegulationMap() {
  return (
    <MapProvider>
      <Layout />
    </MapProvider>
  );
}

function Layout() {
  const {
    hostData: { locationsQuery },
  } = useRegulationDetailsContext();

  useSiteDigestMapPopup();
  useMapLegend();

  if (locationsQuery.isLoading || !locationsQuery.data) return null;
  return <DetailsMap mapData={locationsQuery.data} />;
}

export default RegulationMap;
