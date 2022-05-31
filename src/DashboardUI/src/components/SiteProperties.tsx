import { Card, Col, Row } from 'react-bootstrap';
import { useWaterSiteDetails } from '../hooks/useSiteQuery';
import Domain from 'mdi-react/DomainIcon';
import FormatListBulleted from 'mdi-react/FormatListBulletedIcon';
import { WaterSiteDetails } from '../data-contracts/WaterSiteDetails';

interface waterRightPropertiesProps {
    siteId: string;
}

function SiteProperties(props: waterRightPropertiesProps) {
    // const waterRightDetails = useWaterSiteDetails(props.siteId).data;

    const waterRightDetails: WaterSiteDetails = {
        aggregationInterval: 1,
        aggregationIntervalUnit: "test",
        aggregationStatistic: "test",
        amountUnitCv: "test",
        organizationName: "test name",
        organizationWebsite: "www.google.com",
        reportYearStartMonth: "5",
        reportYearTypeCv: "test",
        state: "NE",
        variableCv: "test",
        variableSpecific: "test, test",
    }
    const getPropertyValueClass = (value: any) => {
        return value !== null ? 'property-value' : 'property-value empty';
    }
    const emptyValue = 'Unknown';

    return (
        <div>
            {waterRightDetails && <>
                <Row className="pt-4">
                    <Col>
                        <Card className="h-100 shadow-sm rounded-3">
                            <Card.Header className="water-rights-header"> <Domain></Domain> Managing Organization Agency</Card.Header>
                            <Card.Body>
                                <div className='d-flex p-2 flex-column'>

                                    <span className='property-name'>Organization Name</span>
                                    <span className={getPropertyValueClass(waterRightDetails.organizationName)}>{waterRightDetails.organizationName || emptyValue}</span>

                                    <span className='property-name'>State</span>
                                    <span className={getPropertyValueClass(waterRightDetails.state)}>{waterRightDetails.state || emptyValue}</span>

                                    <span className='property-name'>Website</span>
                                    <span className={getPropertyValueClass(waterRightDetails.organizationWebsite)}><a href={waterRightDetails.organizationWebsite}>{waterRightDetails.organizationWebsite || emptyValue}</a></span>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="h-100 shadow-sm rounded-3">
                            <Card.Header className="water-rights-header"> <FormatListBulleted></FormatListBulleted> Variable Information</Card.Header>
                            <Card.Body>
                                <div className='d-flex p-2 flex-column'>
                                    <span className='property-name'>Interval</span>
                                    <span className={getPropertyValueClass(waterRightDetails.aggregationInterval)}>{waterRightDetails.aggregationInterval || emptyValue}</span>

                                    <span className='property-name'>Interval Unit</span>
                                    <span className={getPropertyValueClass(waterRightDetails.aggregationIntervalUnit)}>{waterRightDetails.aggregationIntervalUnit || emptyValue}</span>

                                    <span className='property-name'>Statistic</span>
                                    <span className={getPropertyValueClass(waterRightDetails.aggregationStatistic)}>{waterRightDetails.aggregationStatistic || emptyValue}</span>

                                    <span className='property-name'>Maximum Amount Unit</span>
                                    <span className={getPropertyValueClass(waterRightDetails.amountUnitCv)}>{waterRightDetails.amountUnitCv || emptyValue}</span>

                                    <span className='property-name'>Report Year Start Month</span>
                                    <span className={getPropertyValueClass(waterRightDetails.reportYearStartMonth)}>{waterRightDetails.reportYearStartMonth || emptyValue}</span>

                                    <span className='property-name'>Report Year Type</span>
                                    <span className={getPropertyValueClass(waterRightDetails.reportYearTypeCv)}>{waterRightDetails.reportYearTypeCv || emptyValue}</span>

                                    <span className='property-name'>Variable</span>
                                    <span className={getPropertyValueClass(waterRightDetails.variableCv)}>{waterRightDetails.variableCv || emptyValue}</span>

                                    <span className='property-name'>Variable Specific</span>
                                    <span className={getPropertyValueClass(waterRightDetails.variableSpecific)}>{waterRightDetails.variableSpecific || emptyValue}</span>
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