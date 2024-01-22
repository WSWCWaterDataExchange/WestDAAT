import { useCallback, useEffect, useMemo, useState } from "react";
import useSiteClickedOnMapSSRO from "./useSiteClickedOnMapSSRO";
import ErrorCard from "../../components/map-popups/ErrorCard";
import LoadingCard from "../../components/map-popups/LoadingCard";
import SiteSpecificDigestCard from "../../components/map-popups/SiteSpecificDigestCard";
import { useSiteSpecificDigests } from "../queries";

function useSiteSpecificDigestMapPopup() {
  //Because of how we are rendering the water rights to the UI, we cannot manage state inside of the components like SiteSpecificDigestCard.  State has to be managed here.
  const { updatePopup, siteUuid } = useSiteClickedOnMapSSRO();
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleClosePopup = useCallback(() => updatePopup(undefined), [updatePopup]);

  const { data: siteData, isFetching } = useSiteSpecificDigests(siteUuid);
  
  useEffect(() => {
    setCurrentIndex(0);
  }, [siteData, setCurrentIndex]);

  const result = useMemo(() => {
    if (!siteUuid){
      return undefined;
    }
    if (isFetching) {
      return <LoadingCard onClosePopup={handleClosePopup} loadingText={`Retrieving site specific data for ${siteUuid}`} />;
    }
    if (!siteData || siteData.length === 0) {
      return <ErrorCard onClosePopup={handleClosePopup} errorText={`Unable to find site specificdata for ${siteUuid}`} />
    }
    return <SiteSpecificDigestCard siteUuid={siteUuid} siteSpecific={siteData} onSelectedIndexChanged={setCurrentIndex} currentIndex={currentIndex} onClosePopup={handleClosePopup} />;
  }, [isFetching, siteUuid, siteData, currentIndex, handleClosePopup, setCurrentIndex]);

  useEffect(() => {
    if(result)
    {
      updatePopup(result);
    }
  }, [result, updatePopup]);
}
export default useSiteSpecificDigestMapPopup;