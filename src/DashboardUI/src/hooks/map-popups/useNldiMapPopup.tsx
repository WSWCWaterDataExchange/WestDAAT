import React from 'react';
import { useCallback, useEffect, useMemo } from "react";
import useNldiClickedOnMap from "./useNldiClickedOnMap";
import NldiSiteCard from "../../components/map-popups/NldiSiteCard";

function useNldiMapPopup() {
  const { updatePopup, nldiData } = useNldiClickedOnMap();
  const handleClosePopup = useCallback(() => updatePopup(undefined), [updatePopup]);

  const result = useMemo(() => {
    if (!nldiData){
      return undefined;
    }
    return <NldiSiteCard sourceName={nldiData.sourceName} identifier={nldiData.identifier} uri={nldiData.uri} name={nldiData.name} onClosePopup={handleClosePopup} />;
  }, [nldiData, handleClosePopup]);

  useEffect(() => {
    if(result)
    {
      updatePopup(result);
    }
  }, [result, updatePopup]);
}
export default useNldiMapPopup;