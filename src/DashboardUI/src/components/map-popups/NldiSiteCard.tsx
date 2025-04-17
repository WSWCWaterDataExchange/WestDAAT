import React from 'react';
import { Card } from 'react-bootstrap';
import { mdiOpenInNew } from '@mdi/js';
import Icon from '@mdi/react';

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
    <Card className="map-popup-card">
      <Card.Header>
        <div className="d-flex justify-content-between">
          <div>
            <strong>NLDI Site ID:</strong>{' '}
            <a href={uri} target="_blank" rel="noopener noreferrer">
              {identifier} <Icon path={mdiOpenInNew} className="map-popup-card-water-rights-link-icon" />
            </a>
          </div>
          <button type="button" onClick={onClosePopup} className="btn-close map-popup-close-btn"></button>
        </div>
      </Card.Header>
      <Card.Body>
        <div className="mb-2"><strong>Source:</strong> {sourceName}</div>
        <div className="mb-2"><strong>Name:</strong> {name}</div>
        {isTimeSeries && <div className="mb-2 text-warning"><strong>Time Series Available</strong></div>}
      </Card.Body>
    </Card>
  );
}

export default NldiSiteCard;
export type { NldiSiteCardProps };
