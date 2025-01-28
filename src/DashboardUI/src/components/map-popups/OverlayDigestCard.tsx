import React from 'react';
import MapPopupCard from './MapPopupCard';
import { mdiOpenInNew } from '@mdi/js';
import Icon from '@mdi/react';
import { OverlayDigest } from '@data-contracts';

interface OverlayDigestCardProps {
  overlay: OverlayDigest;
  onClosePopup: () => void;
}

function OverlayDigestCard({ overlay, onClosePopup }: OverlayDigestCardProps) {
  const {
    waDeAreaReportingUuid,
    reportingAreaNativeId,
    reportingAreaName,
    waDeOverlayAreaType,
    nativeOverlayAreaType,
  } = overlay;

  return (
    <MapPopupCard onClosePopup={onClosePopup}>
      {{
        header: (
          <div>
            <strong> Overlay ID: </strong>
            {waDeAreaReportingUuid}
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
            <div className="mt-2">
              <a href={`/details/overlay/${waDeAreaReportingUuid}`} target="_blank" rel="noopener noreferrer">
                Overlay Landing Page
                <Icon path={mdiOpenInNew} className="map-popup-card-water-rights-link-icon" />
              </a>
            </div>
          </div>
        ),
      }}
    </MapPopupCard>
  );
}

export default OverlayDigestCard;
