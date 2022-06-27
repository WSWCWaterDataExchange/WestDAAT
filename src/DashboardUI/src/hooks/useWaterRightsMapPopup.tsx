import { useCallback, useEffect, useMemo, useState } from "react";
import useMapPopupOnClick from "./useMapPopupOnClick";
import { MapPopupCard } from "../components/MapPopupCard";
import WaterRightsMapPopup from "../components/WaterRightsMapPopup";
import { waterRightsProperties } from "../config/constants";
import { useWaterRightsDigests } from "./useSiteQuery";

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
      return undefined;
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
