import { useMemo } from "react";
import { useWaterSiteLocation } from "../hooks";
import DetailsMap from "./DetailsMap";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";

interface siteMapProps {
  siteUuid: string;
}

function SiteMap(props: siteMapProps) {
  const { data: waterSiteLocation, isFetching: isWaterSiteLocationLoading } = useWaterSiteLocation(props.siteUuid);

  const featureCollection = useMemo<FeatureCollection<Geometry, GeoJsonProperties> | undefined>(() => {
    if (!waterSiteLocation) return undefined;
    return {
      features: [waterSiteLocation],
      type: "FeatureCollection"
    }
  }, [waterSiteLocation])

  return <DetailsMap isDataLoading={isWaterSiteLocationLoading} mapData={featureCollection} />
}

export default SiteMap;