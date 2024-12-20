import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import MapMarkerIcon from 'mdi-react/MapMarkerIcon';
import { PropertyValue } from '../PropertyValue';
import { useOverlayDetailsContext } from './Provider';

function OverlayProperties() {
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
            <MapMarkerIcon />
            <span>Reporting Area Information</span>
          </Card.Header>
          <Card.Body>
            <div className="d-flex p-2 flex-column">
              <PropertyValue label="WaDE Area Reporting UUID" value={details.waDEAreaReportingUuid} />
              <PropertyValue label="Reporting Area Native ID" value={details.reportingAreaNativeID} />
              <PropertyValue label="WaDE Overlay Area Type" value={details.waDEOverlayAreaType?.join(', ')} />
              <PropertyValue label="Native Reporting Area Type" value={details.nativeReportingAreaType} />
              <PropertyValue label="State" value={details.state} />
              <PropertyValue label="Area Last Updated Date" value={details.areaLastUpdatedDate} />
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default OverlayProperties;
