import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Feature, Geometry, GeoJsonProperties } from 'geojson';
import SiteDigestCard from "../../components/map-popups/SiteDigestCard";
import OverlayDigestCard from "../../components/map-popups/OverlayDigestCard";
import ErrorCard from "../../components/map-popups/ErrorCard";

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

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev + features.length - 1) % features.length);
  }, [features.length]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % features.length);
  }, [features.length]);

  // Determine popup content based on feature type
  const popupContent = useMemo(() => {
    if (!currentFeature || !currentFeature.properties) {
      return <ErrorCard onClosePopup={onClose} errorText="No feature selected." />;
    }

    const { properties } = currentFeature;

    // Check if the feature is an overlay (has oType)
    if (properties.oType) {
      // Map properties to OverlayDigest interface
      const overlayData = {
        waDeAreaReportingUuid: properties.uuid || '',
        reportingAreaNativeId: properties.reportingAreaNativeId || '',
        reportingAreaName: properties.reportingAreaName || '',
        waDeOverlayAreaType: Array.isArray(properties.oType)
          ? properties.oType
          : JSON.parse(properties.oType || '[]'),
        nativeOverlayAreaType: properties.nativeOverlayAreaType || '',
      };

      return (
        <OverlayDigestCard
          overlay={overlayData}
          onClosePopup={onClose}
        />
      );
    }

    // Treat as a site (water right or time series)
    // Map properties to SiteDigest interface
    const hasTimeSeriesData = !!properties.variableType;
    const siteData = {
      siteUuid: properties.uuid || properties.siteUuid || '',
      siteType: properties.siteType || '',
      waterRightsDigests: properties.allocationUuid
        ? [
          {
            allocationUuid: properties.allocationUuid || '',
            nativeId: properties.nativeId || '',
            beneficialUses: Array.isArray(properties.primaryUseCategory)
              ? properties.primaryUseCategory
              : JSON.parse(properties.primaryUseCategory || '[]'),
            priorityDate: properties.priorityDate || null,
            hasTimeSeriesData: hasTimeSeriesData, // Add this property
          },
        ]
        : [],
      hasTimeSeriesData,
      timeSeriesVariableTypes: Array.isArray(properties.variableType)
        ? properties.variableType
        : JSON.parse(properties.variableType || '[]'),
      siteNativeId: properties.siteNativeId || '',
      siteName: properties.siteName || '',
    };

    return (
      <SiteDigestCard
        site={siteData}
        currentIndex={0}
        onSelectedIndexChanged={() => {}}
        onClosePopup={onClose}
      />
    );
  }, [currentFeature, onClose]);

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
