import React, { useCallback, useEffect, useMemo } from 'react';
import useSiteClickedOnMap from './useSiteClickedOnMap';

import NldiSiteCard from '../../components/map-popups/NldiSiteCard';
import { NldiSiteCardProps } from '../../components/map-popups/NldiSiteCard';
import { NldiSiteData } from "./useNldiClickedOnMap";

function useNldiMapPopup() {
  const { updatePopup, features } = useSiteClickedOnMap();
  const handleClosePopup = useCallback(() => updatePopup(undefined), [updatePopup]);

  const nldiFeature = features.find(
    (feature): feature is { type: 'nldi'; nldiData: NldiSiteData } => feature.type === 'nldi'
  );
  const nldiData = nldiFeature?.nldiData;

  const result = useMemo(() => {
    if (!nldiData) {
      return undefined;
    }

    const cardProps: NldiSiteCardProps = {
      sourceName: nldiData.sourceName,
      identifier: nldiData.identifier,
      uri: nldiData.uri,
      name: nldiData.name,
      onClosePopup: handleClosePopup,
      isTimeSeries: nldiData.isTimeSeries || false,
    };

    return <NldiSiteCard {...cardProps} />;
  }, [nldiData, handleClosePopup]);

  useEffect(() => {
    if (result) {
      updatePopup(result);
    } else {
      updatePopup(undefined);
    }
  }, [result, updatePopup]);

  return null;
}

export default useNldiMapPopup;
