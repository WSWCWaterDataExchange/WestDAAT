import { Card, Col, Row } from 'react-bootstrap';
import Domain from 'mdi-react/DomainIcon';
import MapMarker from 'mdi-react/MapMarkerIcon';
import { useSiteDetails } from '../hooks';

interface sitePropertiesProps {
    siteUuid: string;
}

function SiteProperties(props: sitePropertiesProps) {
    // TODO: Update with loading screen after Dub update
    const siteDetails = useSiteDetails(props.siteUuid).data;

    const buildPropertyElements = (label: string, value: string) => {
        return <>
            <span className='property-name'>{label}</span>
            <span className='property-value'>{value}</span>
        </>
    }

    return (
        <div>
            {siteDetails && <>
                <Row className="pt-4">
                    <Col>
                        <Card className="site-card h-100 shadow-sm rounded-3">
                            <Card.Header>
                                <Domain /><span>Site Information</span>
                            </Card.Header>
                            <Card.Body>
                                <div className='d-flex p-2 flex-column'>
                                    {buildPropertyElements('WaDE Site ID', siteDetails.siteUuid)}
                                    {buildPropertyElements('Site Native ID', siteDetails.siteNativeId)}
                                    {buildPropertyElements('Site Name', siteDetails.siteName)}
                                    {buildPropertyElements('Site Type', siteDetails.siteType)}
                                    {buildPropertyElements('POD or POU', siteDetails.podOrPou)}
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
                                    {buildPropertyElements('Longitude', siteDetails.longitude)}
                                    {buildPropertyElements('Latitude', siteDetails.latitude)}
                                    {buildPropertyElements('County', siteDetails.county)}
                                    {buildPropertyElements('Coordinate Method', siteDetails.coordinateMethodCv)}
                                    {buildPropertyElements('Coordinate Accuracy', siteDetails.coordinateAccuracy)}

                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </>}
        </div>
    )
}

export default SiteProperties;