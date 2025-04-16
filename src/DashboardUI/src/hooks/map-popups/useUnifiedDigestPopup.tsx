import { useEffect, useState, useCallback, useMemo } from 'react';
import useSiteClickedOnMap from './useSiteClickedOnMap';
import { useSiteDigest, useOverlayDigests } from '../queries';
import PopupCardCycler from './PopupCardCycler';
import { OverlayDigest } from '@data-contracts';
import SiteDigest from '../../data-contracts/SiteDigest';

type PopupContent =
  | { type: 'loading'; message: string }
  | { type: 'error'; message: string }
  | { type: 'site'; siteData: SiteDigest }
  | { type: 'overlay'; overlayData: OverlayDigest };

function useUnifiedDigestPopup() {
  const { updatePopup, features } = useSiteClickedOnMap();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClosePopup = useCallback(() => updatePopup(undefined), [updatePopup]);

  const currentFeature = features[currentIndex];
  const total = features.length;

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const {
    data: siteData,
    isFetching: isFetchingSite,
  } = useSiteDigest(currentFeature?.siteUuid, {
    enabled: !!currentFeature?.siteUuid && !currentFeature?.oType,
  });

  const {
    data: overlayData,
    isFetching: isFetchingOverlay,
  } = useOverlayDigests(currentFeature?.siteUuid, {
    enabled: !!currentFeature?.siteUuid && !!currentFeature?.oType,
  });

  const popupContent: PopupContent = useMemo(() => {
    if (!currentFeature) {
      return {
        type: 'error',
        message: 'No feature selected',
      } as const;
    }

    const { siteUuid, oType } = currentFeature;

    if (siteUuid && !oType) {
      if (isFetchingSite) {
        return {
          type: 'loading',
          message: `Loading site (${currentIndex + 1} of ${total})`,
        } as const;
      }

      if (!siteData) {
        return {
          type: 'error',
          message: `No site data for: ${siteUuid}`,
        } as const;
      }

      return {
        type: 'site',
        siteData,
      } as const;
    }

    if (siteUuid && oType) {
      if (isFetchingOverlay) {
        return {
          type: 'loading',
          message: `Loading overlay (${currentIndex + 1} of ${total})`,
        } as const;
      }

      if (!overlayData || overlayData.length === 0) {
        return {
          type: 'error',
          message: `No overlay data for: ${siteUuid}`,
        } as const;
      }

      return {
        type: 'overlay',
        overlayData: overlayData[0],
      } as const;
    }

    return {
      type: 'error',
      message: `Unsupported feature (${currentIndex + 1} of ${total})`,
    } as const;
  }, [
    currentFeature,
    siteData,
    overlayData,
    isFetchingSite,
    isFetchingOverlay,
    currentIndex,
    total,
  ]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [features]);

  useEffect(() => {
    if (!features.length) return;


    updatePopup(
      <PopupCardCycler
        {...popupContent}
        currentIndex={currentIndex}
        total={total}
        goToNext={goToNext}
        goToPrevious={goToPrevious}
        onClosePopup={handleClosePopup}
      />
    );

  }, [
    features.length,
    popupContent,
    currentIndex,
    goToNext,
    goToPrevious,
    total,
    updatePopup,
    handleClosePopup,
  ]);

  return {
    features,
    currentIndex,
    setCurrentIndex,
    goToNext,
    goToPrevious,
    total,
  };
}

export default useUnifiedDigestPopup;
