import {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import useSiteClickedOnMap, { ProcessedFeature } from './useSiteClickedOnMap';
import { useSiteDigest, useOverlayDigests } from '../queries';
import PopupCardCycler from './PopupCardCycler';
import { OverlayDigest } from '@data-contracts';
import SiteDigest from '../../data-contracts/SiteDigest';
import { NldiSiteData } from './useNldiClickedOnMap';
import { useMapContext } from '../../contexts/MapProvider';

type PopupContent =
  | { type: 'loading'; message: string }
  | { type: 'error'; message: string }
  | { type: 'site'; siteData: SiteDigest }
  | { type: 'overlay'; overlayData: OverlayDigest }
  | { type: 'nldi'; nldiData: NldiSiteData };

function useUnifiedDigestPopup() {
  const { setGeoJsonData } = useMapContext();
  const { updatePopup, features } = useSiteClickedOnMap();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentFeature = features[currentIndex];
  const total = features.length;

  const goToPrevious = useCallback(() => setCurrentIndex((i) => (i - 1 + total) % total), [total]);
  const goToNext     = useCallback(() => setCurrentIndex((i) => (i + 1) % total), [total]);

  const updateHighlight = useCallback(
    (f?: ProcessedFeature) => {
      if (!f) {
        setGeoJsonData('selected-feature', {
          type: 'FeatureCollection',
          features: [],
        });
      } else {
        setGeoJsonData('selected-feature', {
          type: 'FeatureCollection',
          features: [f.feature],
        });
      }
    },
    [setGeoJsonData],
  );

  const siteOrOverlay =
    currentFeature && (currentFeature.type === 'site' || currentFeature.type === 'overlay')
      ? currentFeature
      : undefined;

  const { data: siteData, isFetching: isFetchingSite } = useSiteDigest(
    siteOrOverlay?.siteUuid,
    { enabled: !!siteOrOverlay?.siteUuid && siteOrOverlay?.type === 'site' },
  );
  const { data: overlayData, isFetching: isFetchingOverlay } = useOverlayDigests(
    siteOrOverlay?.siteUuid,
    { enabled: !!siteOrOverlay?.siteUuid && siteOrOverlay?.type === 'overlay' },
  );

  const popupContent: PopupContent = useMemo(() => {
    if (!currentFeature) return { type: 'error', message: 'No feature selected' };
    if (currentFeature.type === 'site') {
      if (isFetchingSite) return { type: 'loading', message: `Loading site (${currentIndex + 1} of ${total})` };
      if (!siteData)      return { type: 'error', message: `No site data for: ${currentFeature.siteUuid}` };
      return { type: 'site', siteData };
    }
    if (currentFeature.type === 'overlay') {
      if (isFetchingOverlay) return { type: 'loading', message: `Loading overlay (${currentIndex + 1} of ${total})` };
      if (!overlayData?.length) return { type: 'error', message: `No overlay data for: ${currentFeature.siteUuid}` };
      return { type: 'overlay', overlayData: overlayData[0] };
    }
    if (currentFeature.type === 'nldi') return { type: 'nldi', nldiData: currentFeature.nldiData };
    return { type: 'error', message: `Unsupported feature (${currentIndex + 1} of ${total})` };
  }, [
    currentFeature,
    siteData,
    overlayData,
    isFetchingSite,
    isFetchingOverlay,
    currentIndex,
    total,
  ]);

  useEffect(() => setCurrentIndex(0), [features]);

  useEffect(() => updateHighlight(currentFeature), [currentFeature, updateHighlight]);

  const handleClosePopup = useCallback(() => {
    updateHighlight(undefined);
    updatePopup(undefined);
  }, [updateHighlight, updatePopup]);

  useEffect(() => {
    if (!features.length) {
      handleClosePopup();
      return;
    }

    updatePopup(
      <PopupCardCycler
        {...popupContent}
        currentIndex={currentIndex}
        total={total}
        goToNext={goToNext}
        goToPrevious={goToPrevious}
        onClosePopup={handleClosePopup}
      />,
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

  return { features, currentIndex, setCurrentIndex, goToNext, goToPrevious, total };
}

export default useUnifiedDigestPopup;
