import React from 'react';
import SiteDigestCard from "../../components/map-popups/SiteDigestCard";
import OverlayDigestCard from "../../components/map-popups/OverlayDigestCard";
import LoadingCard from "../../components/map-popups/LoadingCard";
import ErrorCard from "../../components/map-popups/ErrorCard";

import SiteDigest from "../../data-contracts/SiteDigest";
import { OverlayDigest } from "@data-contracts";

interface PopupCardCyclerProps {
  type: 'site' | 'overlay' | 'loading' | 'error';
  siteData?: SiteDigest;
  overlayData?: OverlayDigest;
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

  return (
    <ErrorCard
      onClosePopup={onClosePopup}
      errorText="Unsupported feature"
    />
  );
}

export default PopupCardCycler;
