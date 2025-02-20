import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useSiteClickedOnMap from './useSiteClickedOnMap';
import ErrorCard from '../../components/map-popups/ErrorCard';
import LoadingCard from '../../components/map-popups/LoadingCard';
import SiteDigestCard from '../../components/map-popups/SiteDigestCard';
import WaterRightsDigestCard from '../../components/map-popups/WaterRightsDigestCard';
import { useSiteDigest } from '../queries';

type PreferredView = 'waterRight' | 'site';

function useSiteDigestPopup(preferredView: PreferredView = 'waterRight') {
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
      return <LoadingCard onClosePopup={handleClosePopup} loadingText={`Retrieving site data for ${siteUuid}`} />;
    }

    if (!siteData) {
      return <ErrorCard onClosePopup={handleClosePopup} errorText={`Unable to find site data for ${siteUuid}`} />;
    }

    if (preferredView === 'site') {
      return <SiteDigestCard site={siteData} onClosePopup={handleClosePopup} />;
    } else {
      if (siteData.waterRightsDigests && siteData.waterRightsDigests.length > 0) {
        return (
          <WaterRightsDigestCard
            siteUuid={siteUuid}
            waterRights={siteData.waterRightsDigests}
            onSelectedIndexChanged={setCurrentIndex}
            currentIndex={currentIndex}
            onClosePopup={handleClosePopup}
          />
        );
      }
      return <SiteDigestCard site={siteData} onClosePopup={handleClosePopup} />;
    }
  }, [siteUuid, isFetching, siteData, oType, currentIndex, handleClosePopup, preferredView]);

  useEffect(() => {
    if (result) updatePopup(result);
  }, [result, updatePopup]);
}

export default useSiteDigestPopup;
