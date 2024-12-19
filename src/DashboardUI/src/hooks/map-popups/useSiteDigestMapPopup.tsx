import React from 'react';
import { useCallback, useEffect, useMemo } from 'react';
import useSiteClickedOnMap from './useSiteClickedOnMap';
import ErrorCard from '../../components/map-popups/ErrorCard';
import LoadingCard from '../../components/map-popups/LoadingCard';
import SiteDigestCard from '../../components/map-popups/SiteDigestCard';
import { useSiteDigest } from '../queries';

function useSiteDigestMapPopup() {
  //Because of how we are rendering the water rights to the UI, we cannot manage state inside of the components like WaterRightsDigestCard.  State has to be managed here.
  const { updatePopup, siteUuid } = useSiteClickedOnMap();
  const handleClosePopup = useCallback(() => updatePopup(undefined), [updatePopup]);

  const { data: siteData, isFetching } = useSiteDigest(siteUuid);

  const result = useMemo(() => {
    if (!siteUuid) {
      return undefined;
    }
    if (isFetching) {
      return <LoadingCard onClosePopup={handleClosePopup} loadingText={`Retrieving site data for ${siteUuid}`} />;
    }
    if (!siteData) {
      return <ErrorCard onClosePopup={handleClosePopup} errorText={`Unable to find site data for ${siteUuid}`} />;
    }
    return <SiteDigestCard site={siteData} onClosePopup={handleClosePopup} />;
  }, [isFetching, siteUuid, siteData, handleClosePopup]);

  useEffect(() => {
    if (result) {
      updatePopup(result);
    }
  }, [result, updatePopup]);
}
export default useSiteDigestMapPopup;
