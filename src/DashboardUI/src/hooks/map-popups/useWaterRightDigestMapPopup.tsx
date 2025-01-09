import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useSiteClickedOnMap from './useSiteClickedOnMap';
import ErrorCard from '../../components/map-popups/ErrorCard';
import LoadingCard from '../../components/map-popups/LoadingCard';
import WaterRightsDigestCard from '../../components/map-popups/WaterRightsDigestCard';
import { useWaterRightsDigests } from '../queries';

function useWaterRightDigestMapPopup() {
  //Because of how we are rendering the water rights to the UI, we cannot manage state inside of the components like WaterRightsDigestCard.  State has to be managed here.
  const { updatePopup, siteUuid, oType } = useSiteClickedOnMap();
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleClosePopup = useCallback(() => updatePopup(undefined), [updatePopup]);

  const { data: siteData, isFetching } = useWaterRightsDigests(siteUuid);

  useEffect(() => {
    setCurrentIndex(0);
  }, [siteData, setCurrentIndex]);

  const result = useMemo(() => {
    if (!siteUuid || oType) {
      return undefined;
    }
    if (isFetching) {
      return (
        <LoadingCard onClosePopup={handleClosePopup} loadingText={`Retrieving water right data for ${siteUuid}`} />
      );
    }
    if (!siteData || siteData.length === 0) {
      return (
        <ErrorCard onClosePopup={handleClosePopup} errorText={`Unable to find water right data for ${siteUuid}`} />
      );
    }
    return (
      <WaterRightsDigestCard
        siteUuid={siteUuid}
        waterRights={siteData}
        onSelectedIndexChanged={setCurrentIndex}
        currentIndex={currentIndex}
        onClosePopup={handleClosePopup}
      />
    );
  }, [isFetching, siteUuid, oType, siteData, currentIndex, handleClosePopup, setCurrentIndex]);

  useEffect(() => {
    if (result) {
      updatePopup(result);
    }
  }, [result, updatePopup]);
}

export default useWaterRightDigestMapPopup;
