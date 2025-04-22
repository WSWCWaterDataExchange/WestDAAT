import React from 'react';
import Icon from '@mdi/react';
import { mdiOpenInNew } from '@mdi/js';
import MapPopupCard from './MapPopupCard';

interface NldiSiteCardProps {
  sourceName: string;
  identifier: string;
  uri: string;
  name: string;
  onClosePopup: () => void;
  isTimeSeries?: boolean;
}

function NldiSiteCard({
                        sourceName,
                        identifier,
                        uri,
                        name,
                        onClosePopup,
                        isTimeSeries = false,
                      }: NldiSiteCardProps) {
  return (
    <MapPopupCard onClosePopup={onClosePopup}>
      {{
        header: (
          <div className="d-flex justify-content-between">
            <div>
              <strong>NLDI Site ID:</strong>{' '}
              <a href={uri} target="_blank" rel="noopener noreferrer">
                {identifier}{' '}
                <Icon
                  path={mdiOpenInNew}
                  className="map-popup-card-water-rights-link-icon"
                />
              </a>
            </div>
            {/* no custom close button here—MapPopupCard will inject it */}
          </div>
        ),
        body: (
          <div className="map-popup-card-water-rights-body">
            <div className="mb-2">
              <div>
                <strong>Source:</strong>
              </div>
              {sourceName}
            </div>
            <div className="mb-2">
              <div>
                <strong>Name:</strong>
              </div>
              {name}
            </div>
            {isTimeSeries && (
              <div className="mb-2 text-warning">
                <strong>Time Series Available</strong>
              </div>
            )}
            <div className="mb-2">
              <div className="map-popup-card-water-rights-native-id-row">
                <strong>Identifier:</strong>
              </div>
              <div>
                <a
                  href={`/details/site/${identifier}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {identifier}{' '}
                  <Icon
                    path={mdiOpenInNew}
                    className="map-popup-card-water-rights-link-icon"
                  />
                </a>
              </div>
            </div>
          </div>
        ),
      }}
    </MapPopupCard>
  );
}

export default NldiSiteCard;
export type { NldiSiteCardProps };
