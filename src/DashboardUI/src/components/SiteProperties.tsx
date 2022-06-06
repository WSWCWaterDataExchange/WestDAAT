import { Card, Col, Row } from 'react-bootstrap';
import Domain from 'mdi-react/DomainIcon';
import { useSiteDetails } from '../hooks';

interface sitePropertiesProps {
    siteUuid: string;
}

function SiteProperties(props: sitePropertiesProps) {
    // TODO: Update with loading screen after Dub update
    const siteDetails = useSiteDetails(props.siteUuid).data;

    const getPropertyValueClass = (value: any) => {
        return value !== null ? 'property-value' : 'property-value empty';
    }
    const emptyValue = 'Unknown';

    return (
        <div>
            {siteDetails && <>
                <Row className="pt-4">
                    <Col lg="12" xl="6">
                        <Card className="h-100 shadow-sm rounded-3">
                            <Card.Header className="site-header"> <Domain></Domain>Site Information</Card.Header>
                            <Card.Body>
                                <div className='d-flex p-2 flex-column'>

                                    <span className='property-name'>WaDE Site ID</span>
                                    <span className={getPropertyValueClass(siteDetails.siteUuid)}>{siteDetails.siteUuid || emptyValue}</span>

                                    <span className='property-name'>Site Native ID</span>
                                    <span className={getPropertyValueClass(siteDetails.siteNativeId)}>{siteDetails.siteNativeId || emptyValue}</span>

                                    <span className='property-name'>Site Name</span>
                                    <span className={getPropertyValueClass(siteDetails.siteName)}>{siteDetails.siteName || emptyValue}</span>

                                    <span className='property-name'>Longitude</span>
                                    <span className={getPropertyValueClass(siteDetails.longitude)}>{siteDetails.longitude || emptyValue}</span>

                                    <span className='property-name'>Latitude</span>
                                    <span className={getPropertyValueClass(siteDetails.latitude)}>{siteDetails.latitude || emptyValue}</span>

                                    <span className='property-name'>County</span>
                                    <span className={getPropertyValueClass(siteDetails.county)}>{siteDetails.county || emptyValue}</span>

                                    <span className='property-name'>Site Type</span>
                                    <span className={getPropertyValueClass(siteDetails.siteType)}>{siteDetails.siteType || emptyValue}</span>

                                    <span className='property-name'>POD or POU</span>
                                    <span className={getPropertyValueClass(siteDetails.podOrPou)}>{siteDetails.podOrPou || emptyValue}</span>
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