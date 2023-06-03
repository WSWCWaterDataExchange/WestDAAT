import { Card, Col, Row } from 'react-bootstrap';
import Domain from 'mdi-react/DomainIcon';
import MapMarker from 'mdi-react/MapMarkerIcon';
import { useSiteDetailsContext } from './Provider';
import { PropertyValue } from '../PropertyValue';

function SiteProperties() {
  const {
    hostData: {
      detailsQuery: {data: siteDetails}
    }
  } = useSiteDetailsContext();

  return (
    <div>
      {siteDetails && 
        <Row className="pt-4">
          <Col>
            <Card className="site-card h-100 shadow-sm rounded-3">
              <Card.Header>
                <Domain /><span>Site Information</span>
              </Card.Header>
              <Card.Body>
                <div className='d-flex p-2 flex-column'>
                  <PropertyValue label='WaDE Site ID' value={siteDetails.siteUuid} />
                  <PropertyValue label='Site Native ID' value={siteDetails.siteNativeId} />
                  <PropertyValue label='Site Name' value={siteDetails.siteName} />
                  <PropertyValue label='Site Type' value={siteDetails.siteType} />
                  <PropertyValue label='POD or POU' value={siteDetails.podOrPou} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="site-card h-100 shadow-sm rounded-3">
              <Card.Header>
                <MapMarker /><span>Location</span>
              </Card.Header>
              <Card.Body>
                <div className='d-flex p-2 flex-column'>
                  <PropertyValue label='Longitude' value={siteDetails.longitude} decimalPositions={6} />
                  <PropertyValue label='Latitude' value={siteDetails.latitude} decimalPositions={6} />
                  <PropertyValue label='County' value={siteDetails.county} />
                  <PropertyValue label='Coordinate Method' value={siteDetails.coordinateMethodCv} />
                  <PropertyValue label='Coordinate Accuracy' value={siteDetails.coordinateAccuracy} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      }
    </div>
  )
}

export default SiteProperties;