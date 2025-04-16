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

  const isTimeSeries = (nldiData as NldiSiteData)?.isTimeSeries;
  const identifier = (nldiData as NldiSiteData)?.identifier;

  const { data: siteData, isFetching } = useSiteDigest(identifier);

  const result = useMemo(() => {
    if (!nldiData) return undefined;

    if (isTimeSeries) {
      if (isFetching) {
        return (
          <LoadingCard
            onClosePopup={handleClosePopup}
            loadingText={`Retrieving site data for ${identifier}`}
          />
        );
      }

      if (!siteData) {
        return (
          <ErrorCard
            onClosePopup={handleClosePopup}
            errorText={`Unable to find site data for ${identifier}`}
          />
        );
      }

      return (
        <SiteDigestCard
          site={siteData}
          onClosePopup={handleClosePopup}
        />
      );
    }

    return (
      <NldiSiteCard
        sourceName={(nldiData as NldiSiteData).sourceName}
        identifier={identifier}
        uri={(nldiData as NldiSiteData).uri}
        name={(nldiData as NldiSiteData).name}
        onClosePopup={handleClosePopup}
      />
    );
  }, [nldiData, isTimeSeries, siteData, isFetching, identifier, handleClosePopup]);

  useEffect(() => {
    if (result) {
      updatePopup(result);
    }
  }, [result, updatePopup]);

  return null;
}

export default useNldiMapPopup;
