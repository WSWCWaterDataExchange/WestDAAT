import { useCallback, useEffect, useMemo, useState } from "react";
import useMapPopupOnClick from "./useMapPopupOnClick";
import { MapPopupCard } from "../components/MapPopupCard";
import WaterRightsMapPopup from "../components/WaterRightsMapPopup";
import { nldiSiteProperties, waterRightsProperties } from "../config/constants";
import { useWaterRightsDigests } from "./useSiteQuery";
import { Feature, GeoJsonProperties, Geometry } from "geojson";
import NldiSiteMapPopUp from "../components/NldiSiteMapPopup";

export function useWaterRightsMapPopup() {
  const { updatePopup, clickedFeatures } = useMapPopupOnClick();
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleClosePopup = useCallback(() => updatePopup(undefined), [updatePopup]);

  const clickedSiteUuid = useMemo(() => {
    if (!clickedFeatures || clickedFeatures.length === 0) {
      return undefined;
    }
    const feature = clickedFeatures.find(a => a.properties && a.properties[waterRightsProperties.siteUuid as string]);
    if (!feature || !feature.properties) {
      return undefined;
    }
    return feature.properties[waterRightsProperties.siteUuid as string];
  }, [clickedFeatures]);

  const { data, isFetching } = useWaterRightsDigests(clickedSiteUuid);

  useEffect(() => {
    setCurrentIndex(0);
  }, [data, setCurrentIndex]);

  const result = useMemo(() => {
    if (!clickedSiteUuid) {
      if (clickedFeatures && clickedFeatures.length > 0) {
        const nldiSite = getNldiSite(clickedFeatures[0]);
        if(!nldiSite || !nldiSite.sourceName){
          return undefined;
        }
        return <NldiSiteMapPopUp sourceName={nldiSite.sourceName} identifier={nldiSite.identifier} uri={nldiSite.uri} name={nldiSite.name} onClosePopup={handleClosePopup} />;
      }
    }
    if (isFetching) {
      return <MapPopupCard onClosePopup={handleClosePopup}>
        {{
          header: "Loading",
          body: <span className="text-nowrap">Retrieving data for {clickedSiteUuid}</span>
        }}
      </MapPopupCard>;
    }
    if (!data || data.length === 0) {
      return <MapPopupCard onClosePopup={handleClosePopup}>
        {{
          header: "Error",
          body: <span className="text-nowrap">Unable to find data for {clickedSiteUuid}</span>
        }}
      </MapPopupCard>;
    }
    return <WaterRightsMapPopup siteUuid={clickedSiteUuid} waterRights={data} onSelectedIndexChanged={setCurrentIndex} currentIndex={currentIndex} onClosePopup={handleClosePopup} />;
  }, [isFetching, clickedSiteUuid, data, currentIndex, handleClosePopup, setCurrentIndex]);

  useEffect(() => {
    updatePopup(result);
  }, [updatePopup, result]);
}

function getNldiSite(nldiFeature: Feature<Geometry, GeoJsonProperties> ) {
  if(nldiFeature.properties) {
    return { 
      sourceName: nldiFeature.properties[nldiSiteProperties.sourceName as string],
      identifier: nldiFeature.properties[nldiSiteProperties.identifier as string],
      name: nldiFeature.properties[nldiSiteProperties.name as string],
      uri: nldiFeature.properties[nldiSiteProperties.uri as string]        
    };
  };
  return undefined;
}