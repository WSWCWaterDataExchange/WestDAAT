import { useContext, useMemo } from "react";
import DetailsMap from "../DetailsMap";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import useWaterRightDigestMapPopup from "../../../hooks/map-popups/useWaterRightDigestMapPopup";
import { SiteDetailsContext } from "./Provider";
import MapProvider from "../../../contexts/MapProvider";
import { useMapLegend } from "./hooks/useMapLegend";

function SiteMap() {
  return (
    <MapProvider>
      <Layout />
    </MapProvider>
  );
}

function Layout() {
  const {
    hostData: {
      locationsQuery
    }
  } = useContext(SiteDetailsContext)

  const featureCollection = useMemo<FeatureCollection<Geometry, GeoJsonProperties> | undefined>(() => {
    if (!locationsQuery.data) return undefined;
    return {
      features: [locationsQuery.data],
      type: "FeatureCollection"
    }
  }, [locationsQuery.data])

  useWaterRightDigestMapPopup();
  useMapLegend();

  return <DetailsMap isDataLoading={locationsQuery.isLoading} mapData={featureCollection} />
}

export default SiteMap;