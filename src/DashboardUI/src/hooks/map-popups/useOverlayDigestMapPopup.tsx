import React, { useCallback, useEffect, useMemo } from 'react';
import ErrorCard from '../../components/map-popups/ErrorCard';
import LoadingCard from '../../components/map-popups/LoadingCard';
import OverlayDigestCard from '../../components/map-popups/OverlayDigestCard';
import { useOverlayDigests } from '../queries';
import useSiteClickedOnMap from './useSiteClickedOnMap';

function useOverlayDigestMapPopup() {
  const { updatePopup, siteUuid, oType } = useSiteClickedOnMap();
  const handleClosePopup = useCallback(() => updatePopup(undefined), [updatePopup]);

  const { data: overlayData, isFetching } = useOverlayDigests(siteUuid);

  const result = useMemo(() => {
    if (!siteUuid || !oType) {
      return undefined;
    }
    if (isFetching) {
      return <LoadingCard onClosePopup={handleClosePopup} loadingText={`Retrieving overlay digest for ${siteUuid}`} />;
    }
    if (!overlayData || overlayData.length === 0) {
      return <ErrorCard onClosePopup={handleClosePopup} errorText={`No overlay digest found for ${siteUuid}`} />;
    }
    return <OverlayDigestCard overlay={overlayData[0]} onClosePopup={handleClosePopup} />;
  }, [isFetching, siteUuid, oType, overlayData, handleClosePopup]);

  useEffect(() => {
    if (result) {
      updatePopup(result);
    }
  }, [result, updatePopup]);
}

export default useOverlayDigestMapPopup;
