import React from 'react';
import SiteDigestCard from '../../components/map-popups/SiteDigestCard';
import OverlayDigestCard from '../../components/map-popups/OverlayDigestCard';
import NldiSiteCard from '../../components/map-popups/NldiSiteCard';
import LoadingCard from '../../components/map-popups/LoadingCard';
import ErrorCard from '../../components/map-popups/ErrorCard';
import SiteDigest from '../../data-contracts/SiteDigest';
import { OverlayDigest } from '@data-contracts';
import { NldiSiteData } from '../../hooks/map-popups/useNldiClickedOnMap';

interface PopupCardCyclerProps {
  type: 'site' | 'overlay' | 'loading' | 'error' | 'nldi';
  siteData?: SiteDigest;
  overlayData?: OverlayDigest;
  nldiData?: NldiSiteData;
  currentIndex: number;
  total: number;
  goToNext: () => void;
  goToPrevious: () => void;
  onClosePopup: () => void;
  message?: string;
}

function PopupCardCycler(props: PopupCardCyclerProps) {
  const {
    type,
    siteData,
    overlayData,
    nldiData,
    currentIndex,
    total,
    goToNext,
    goToPrevious,
    onClosePopup,
    message,
  } = props;

  if (type === 'loading') {
    return (
      <LoadingCard
        onClosePopup={onClosePopup}
        loadingText={message ?? 'Loading...'}
      />
    );
  }

  if (type === 'error') {
    return (
      <ErrorCard
        onClosePopup={onClosePopup}
        errorText={message ?? 'Something went wrong'}
      />
    );
  }

  if (type === 'site' && siteData) {
    return (
      <SiteDigestCard
        site={siteData}
        currentIndex={currentIndex}
        total={total}
        goToNext={goToNext}
        goToPrevious={goToPrevious}
        onClosePopup={onClosePopup}
      />
    );
  }

  if (type === 'overlay' && overlayData) {
    return (
      <OverlayDigestCard
        overlay={overlayData}
        currentIndex={currentIndex}
        total={total}
        goToNext={goToNext}
        goToPrevious={goToPrevious}
        onClosePopup={onClosePopup}
      />
    );
  }

  if (type === 'nldi' && nldiData) {
    return (
      <NldiSiteCard
        sourceName={nldiData.sourceName}
        identifier={nldiData.identifier}
        uri={nldiData.uri}
        name={nldiData.name}
        onClosePopup={onClosePopup}
      />
    );
  }

  return (
    <ErrorCard
      onClosePopup={onClosePopup}
      errorText="Unsupported feature"
    />
  );
}

export default PopupCardCycler;
