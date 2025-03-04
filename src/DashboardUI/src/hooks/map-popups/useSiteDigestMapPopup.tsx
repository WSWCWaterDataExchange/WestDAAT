import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useSiteClickedOnMap from './useSiteClickedOnMap';
import ErrorCard from '../../components/map-popups/ErrorCard';
import LoadingCard from '../../components/map-popups/LoadingCard';
import SiteDigestCard from '../../components/map-popups/SiteDigestCard';
import { useSiteDigest } from '../queries';

function useSiteDigestPopup() {
  const { updatePopup, siteUuid, oType } = useSiteClickedOnMap();
  const handleClosePopup = useCallback(() => updatePopup(undefined), [updatePopup]);
  const { data: siteData, isFetching } = useSiteDigest(siteUuid);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [siteData]);

  const result = useMemo(() => {
    if (!siteUuid || oType) return undefined;

    if (isFetching) {
      return <LoadingCard onClosePopup={handleClosePopup} loadingText={`Retrieving site data for ${siteUuid}`}/>;
    }

    if (!siteData) {
      return <ErrorCard onClosePopup={handleClosePopup} errorText={`Unable to find site data for ${siteUuid}`}/>;
    }

    return <SiteDigestCard
      site={siteData}
      currentIndex={currentIndex}
      onClosePopup={handleClosePopup}
      onSelectedIndexChanged={setCurrentIndex}
    />;

  }, [siteUuid, isFetching, siteData, oType, currentIndex, handleClosePopup]);

  useEffect(() => {
    if (result) updatePopup(result);
  }, [result, updatePopup]);
}

export default useSiteDigestPopup;
