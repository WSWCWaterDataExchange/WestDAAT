import React from 'react';
import Icon from '@mdi/react';
import MapPopupCard from './MapPopupCard';
import { mdiOpenInNew } from '@mdi/js';

interface NldiSiteMapPopupProps {
  sourceName: string;
  identifier: string;
  uri: string;
  name: string;
  onClosePopup: () => void;
}
function NldiSiteCard(props: NldiSiteMapPopupProps) {
  const { sourceName, identifier, uri, name, onClosePopup } = props;
  return (
    <MapPopupCard onClosePopup={onClosePopup}>
      {{
        header: <div>{identifier}</div>,
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
            <div className="mb-2">
              <div className="map-popup-card-water-rights-native-id-row">
                <strong>Identifier:</strong>
              </div>
              <div>
                <a href={`/details/site/${identifier}`} target="_blank" rel="noopener noreferrer">
                  {identifier} <Icon path={mdiOpenInNew} className="map-popup-card-water-rights-link-icon" />
                </a>
                {/* I changed this to site page? what do we want here?  */}
              </div>
            </div>
          </div>
        ),
      }}
    </MapPopupCard>
  );
}
export default NldiSiteCard;
