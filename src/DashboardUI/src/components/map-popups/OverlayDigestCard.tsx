import React from 'react';
import MapPopupCard from './MapPopupCard';
import { mdiOpenInNew, mdiChevronLeftBox, mdiChevronRightBox } from '@mdi/js';
import Icon from '@mdi/react';
import { OverlayDigest } from '@data-contracts';

interface OverlayDigestCardProps {
  overlay: OverlayDigest;
  onClosePopup: () => void;
  currentIndex?: number;
  total?: number;
  goToNext?: () => void;
  goToPrevious?: () => void;
}

function OverlayDigestCard({
                             overlay,
                             onClosePopup,
                             currentIndex,
                             total,
                             goToNext,
                             goToPrevious,
                           }: OverlayDigestCardProps) {
  const {
    waDeAreaReportingUuid,
    reportingAreaNativeId,
    reportingAreaName,
    waDeOverlayAreaType,
    nativeOverlayAreaType,
  } = overlay;

  const showNavigation = total && total > 1;

  return (
    <MapPopupCard onClosePopup={onClosePopup}>
      {{
        header: (
          <div className="flex justify-between items-center">
            <div>
              <strong>Overlay ID:</strong>{' '}
              <a href={`/details/overlay/${waDeAreaReportingUuid}`} target="_blank" rel="noopener noreferrer">
                {waDeAreaReportingUuid}
                <Icon path={mdiOpenInNew} className="map-popup-card-water-rights-link-icon" />
              </a>
            </div>
            {showNavigation && (
              <div className="flex items-center gap-2">
                <button onClick={goToPrevious} className="nav-prev-feature">
                  <Icon path={mdiChevronLeftBox} />
                </button>
                <span>{(currentIndex ?? 0) + 1} of {total}</span>
                <button onClick={goToNext} className="nav-next-feature">
                  <Icon path={mdiChevronRightBox} />
                </button>
              </div>
            )}
          </div>
        ),
        body: (
          <div className="map-popup-card-overlay-body">
            <div className="mb-2">
              <strong>Reporting Area Native ID:</strong> {reportingAreaNativeId}
            </div>
            <div className="mb-2">
              <strong>Reporting Area Name:</strong> {reportingAreaName}
            </div>
            <div className="mb-2">
              <strong>WaDE Overlay Area Types:</strong> {waDeOverlayAreaType.join(', ')}
            </div>
            <div className="mb-2">
              <strong>Native Overlay Area Type:</strong> {nativeOverlayAreaType}
            </div>
          </div>
        ),
      }}
    </MapPopupCard>
  );
}

export default OverlayDigestCard;
