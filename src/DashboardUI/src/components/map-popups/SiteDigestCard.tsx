import React from 'react';
import MapPopupCard from './MapPopupCard';
import { mdiOpenInNew } from '@mdi/js';
import Icon from '@mdi/react';
import SiteDigest from '../../data-contracts/SiteDigest';

interface SiteDigestMapPopupProps {
  site: SiteDigest;
  onClosePopup: () => void;
}

function SiteDigestCard(props: SiteDigestMapPopupProps) {
  const { onClosePopup } = props;
  const { siteNativeId, siteName, siteType, siteUuid, hasTimeSeriesData } = props.site;
  return (
    <MapPopupCard onClosePopup={onClosePopup}>
      {{
        header: (
          <div>
            Site ID:{' '}
            <a href={`/details/site/${siteUuid}`} target="_blank" rel="noopener noreferrer">
              {siteUuid} <Icon path={mdiOpenInNew} className="map-popup-card-water-rights-link-icon" />
            </a>
          </div>
        ),
        body: (
          <div className="map-popup-card-water-rights-body">
            <div className="mb-2">
              <div>
                <strong>Native ID:</strong>
              </div>
              {siteNativeId}
            </div>
            <div className="mb-2">
              <div>
                <strong>Name:</strong>
              </div>
              {siteName}
            </div>
            <div className="mb-0">
              <div>
                <strong>Type:</strong>
              </div>
              {siteType}
            </div>
            {hasTimeSeriesData && (
              <div className="mt-2">
                <a href={`/details/site/${siteUuid}`} target="_blank" rel="noopener noreferrer">
                  Time Series Landing Page{' '}
                  <Icon path={mdiOpenInNew} className="map-popup-card-water-rights-link-icon" />
                </a>
              </div>
            )}
          </div>
        ),
      }}
    </MapPopupCard>
  );
}

export default SiteDigestCard;
