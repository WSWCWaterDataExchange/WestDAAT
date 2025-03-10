import React, { useCallback, useEffect, useMemo } from 'react';
import useNldiClickedOnMap, { NldiSiteData } from './useNldiClickedOnMap';
import NldiSiteCard from '../../components/map-popups/NldiSiteCard';
import SiteDigestCard from '../../components/map-popups/SiteDigestCard';
import { useSiteDigest } from '../queries';
import LoadingCard from '../../components/map-popups/LoadingCard';
import ErrorCard from '../../components/map-popups/ErrorCard';

function useNldiMapPopup() {
  const { updatePopup, nldiData } = useNldiClickedOnMap();
  const handleClosePopup = useCallback(() => updatePopup(undefined), [updatePopup]);

  const { data: siteData, isFetching } = useSiteDigest(
    nldiData && (nldiData as NldiSiteData).isTimeSeries ? nldiData.identifier : '',
  );

  const result = useMemo(() => {
    if (!nldiData) return undefined;

    if ((nldiData as NldiSiteData).isTimeSeries) {
      if (isFetching) {
        return (
          <LoadingCard
            onClosePopup={handleClosePopup}
            loadingText={`Retrieving site data for ${(nldiData as NldiSiteData).identifier}`}
          />
        );
      }
      if (!siteData) {
        return (
          <ErrorCard
            onClosePopup={handleClosePopup}
            errorText={`Unable to find site data for ${(nldiData as NldiSiteData).identifier}`}
          />
        );
      }
      return (
        <SiteDigestCard
          site={siteData}
          currentIndex={0}
          onSelectedIndexChanged={() => {}}
          onClosePopup={handleClosePopup}
        />
      );
    }

    return (
      <NldiSiteCard
        sourceName={(nldiData as NldiSiteData).sourceName}
        identifier={(nldiData as NldiSiteData).identifier}
        uri={(nldiData as NldiSiteData).uri}
        name={(nldiData as NldiSiteData).name}
        onClosePopup={handleClosePopup}
      />
    );
  }, [nldiData, siteData, isFetching, handleClosePopup]);

  useEffect(() => {
    if (result) {
      updatePopup(result);
    }
  }, [result, updatePopup]);

  return null;
}
export default useNldiMapPopup;
