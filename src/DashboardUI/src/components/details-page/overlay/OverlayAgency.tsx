import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import DomainIcon from 'mdi-react/DomainIcon';
import { PropertyValue } from '../PropertyValue';
import { useOverlayDetailsContext } from './Provider';

function OverlayAgency() {
  const {
    hostData: { detailsQuery },
  } = useOverlayDetailsContext();

  const details = detailsQuery.data;

  if (!details) return null;

  return (
    <Row className="pt-2">
      <Col>
        <Card className="overlay-card h-100 shadow-sm rounded-3 mb-2">
          <Card.Header>
            <DomainIcon />
            <span>Managing Agency</span>
          </Card.Header>
          <Card.Body>
            <div className="d-flex p-2 flex-column">
              <PropertyValue label="Organization Name" value={details.organizationName} />
              <PropertyValue label="State" value={details.organizationState} />
              <PropertyValue label="Website" value={details.organizationWebsite} isUrl={true} />
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default OverlayAgency;
