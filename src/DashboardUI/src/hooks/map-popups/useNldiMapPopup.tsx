import React, { useEffect, useCallback } from 'react';
import useSiteClickedOnMap, { ProcessedFeature } from './useSiteClickedOnMap';
import NldiSiteCard, { NldiSiteCardProps } from '../../components/map-popups/NldiSiteCard';

function useNldiMapPopup() {
  const { updatePopup, features } = useSiteClickedOnMap();

  const handleClosePopup = useCallback(() => {
    updatePopup(undefined);
  }, [updatePopup]);

  useEffect(() => {
    const nldiFeature = features.find((f): f is ProcessedFeature & { type: 'nldi' } => f.type === 'nldi');
    if (!nldiFeature) {
      updatePopup(undefined);
      return;
    }

    const { nldiData } = nldiFeature;
    const props: NldiSiteCardProps = {
      sourceName: nldiData.sourceName,
      identifier: nldiData.identifier,
      uri: nldiData.uri,
      name: nldiData.name,
      onClosePopup: handleClosePopup,
      isTimeSeries: nldiData.isTimeSeries || false,
    };

    updatePopup(<NldiSiteCard {...props} />);
  }, [features, updatePopup, handleClosePopup]);

  return null;
}

export default useNldiMapPopup;
