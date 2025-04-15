import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Feature, Geometry, GeoJsonProperties } from 'geojson';
import SiteDigestCard from "../../components/map-popups/SiteDigestCard";
import OverlayDigestCard from "../../components/map-popups/OverlayDigestCard";
import ErrorCard from "../../components/map-popups/ErrorCard";
import LoadingCard from "../../components/map-popups/LoadingCard";
import { useSiteDigest, useOverlayDigests } from '../queries';

interface MultiFeaturePopupProps {
  features: Feature<Geometry, GeoJsonProperties>[];
  latitude: number;
  longitude: number;
  onClose: () => void;
}

export default function MultiFeaturePopup({
                                            features,
                                            latitude,
                                            longitude,
                                            onClose,
                                          }: MultiFeaturePopupProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index when features change
  useEffect(() => {
    setCurrentIndex(0);
  }, [features]);

  // Log features for debugging
  useEffect(() => {
    console.log('Clicked features:', features);
  }, [features]);

  // Get current feature
  const currentFeature = useMemo(() => features[currentIndex], [features, currentIndex]);

  // Determine feature type
  const featureType = useMemo(() => {
    if (!currentFeature || !currentFeature.properties) return null;
    if (currentFeature.properties.oType) return 'overlay';
    if (currentFeature.properties.siteUuid || currentFeature.properties.uuid) return 'site';
    return null;
  }, [currentFeature]);

  // Extract identifiers for data fetching
  const siteUuid = currentFeature?.properties?.siteUuid || currentFeature?.properties?.uuid;
  const overlayUuid = currentFeature?.properties?.uuid;

  // Fetch data based on feature type
  const { data: siteData, isFetching: isSiteFetching, error: siteError } = featureType === 'site'
    ? useSiteDigest(siteUuid)
    : { data: null, isFetching: false, error: null };

  const { data: overlayData, isFetching: isOverlayFetching, error: overlayError } = featureType === 'overlay'
    ? useOverlayDigests(overlayUuid)
    : { data: null, isFetching: false, error: null };

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev + features.length - 1) % features.length);
  }, [features.length]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % features.length);
  }, [features.length]);

  // Determine popup content
  const popupContent = useMemo(() => {
    if (!currentFeature || !featureType) {
      return <ErrorCard onClosePopup={onClose} errorText="No feature selected." />;
    }

    if (featureType === 'site') {
      if (isSiteFetching) {
        return <LoadingCard onClosePopup={onClose} loadingText={`Retrieving site data for ${siteUuid}`} />;
      }
      if (siteError || !siteData) {
        return <ErrorCard onClosePopup={onClose} errorText={`Unable to find site data for ${siteUuid}`} />;
      }
      return (
        <SiteDigestCard
          site={siteData}
          currentIndex={0}
          onSelectedIndexChanged={() => {}}
          onClosePopup={onClose}
        />
      );
    }

    if (featureType === 'overlay') {
      if (isOverlayFetching) {
        return <LoadingCard onClosePopup={onClose} loadingText={`Retrieving overlay digest for ${overlayUuid}`} />;
      }
      if (overlayError || !overlayData || overlayData.length === 0) {
        return <ErrorCard onClosePopup={onClose} errorText={`No overlay digest found for ${overlayUuid}`} />;
      }
      return <OverlayDigestCard overlay={overlayData[0]} onClosePopup={onClose} />;
    }

    return <ErrorCard onClosePopup={onClose} errorText="Unknown feature type." />;
  }, [
    currentFeature,
    featureType,
    isSiteFetching,
    siteError,
    siteData,
    isOverlayFetching,
    overlayError,
    overlayData,
    onClose,
    siteUuid,
    overlayUuid,
  ]);

  return (
    <div className="multi-feature-popup">
      {features.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <button onClick={goPrev}>Prev</button>
          <div>
            {currentIndex + 1} of {features.length}
          </div>
          <button onClick={goNext}>Next</button>
        </div>
      )}
      {popupContent}
    </div>
  );
}
