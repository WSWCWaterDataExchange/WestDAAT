import { Card, Col, Row } from 'react-bootstrap';
import { useWaterRightDetails } from '../hooks/useWaterRightQuery';
import Domain from 'mdi-react/DomainIcon';
import FormatListBulleted from 'mdi-react/FormatListBulletedIcon';
import ClipBoardSearch from 'mdi-react/ClipboardSearchIcon';

interface waterRightPropertiesProps {
  waterRightId: string;
}

function WaterRightProperties(props: waterRightPropertiesProps) {
  // TODO: Update with loading screen after Dub update
  const waterRightDetails = useWaterRightDetails(+props.waterRightId).data;

  return (
    <div>

      {waterRightDetails && <>
        <Row>
          <Col>
            <Card>
              <Card.Header className="water-rights-header"> <Domain></Domain> Managing Organization Agency</Card.Header>
              <Card.Body>
                <div className='d-flex p-2 flex-column'>

                  <span className='property-name'>Organization Name</span>
                  <span className='property-value'>{waterRightDetails.organizationName}</span>

                  <span className='property-name'>State</span>
                  <span className='property-value'>{waterRightDetails.state}</span>

                  <span className='property-name'>Website</span>
                  <span className='property-value'><a href={waterRightDetails.organizationWebsite}>{waterRightDetails.organizationWebsite}</a></span>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Header className="water-rights-header"> <FormatListBulleted></FormatListBulleted> Variable Information</Card.Header>
              <Card.Body>
                <div className='d-flex p-2 flex-column'>
                  <span className='property-name'>Interval</span>
                  <span className='property-value'>{waterRightDetails.aggregationInterval}</span>

                  <span className='property-name'>Interval Unit</span>
                  <span className='property-value'>{waterRightDetails.aggregationIntervalUnit}</span>

                  <span className='property-name'>Statistic</span>
                  <span className='property-value'>{waterRightDetails.aggregationStatistic}</span>

                  <span className='property-name'>Maximum Amount Unit</span>
                  <span className='property-value'>{waterRightDetails.amountUnitCv}</span>

                  <span className='property-name'>Report Year Start Month</span>
                  <span className='property-value'>{waterRightDetails.reportYearStartMonth}</span>

                  <span className='property-name'>Report Year Type</span>
                  <span className='property-value'>{waterRightDetails.reportYearType}</span>

                  <span className='property-name'>Variable</span>
                  <span className='property-value'>{waterRightDetails.variableCv}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Header className="water-rights-header"> <ClipBoardSearch></ClipBoardSearch> Method Information</Card.Header>
              <Card.Body>
                <div className='d-flex p-2 flex-column'>
                  <span className='property-name'>Applicable Resource Type</span>
                  <span className='property-value'>{waterRightDetails.applicableResourceType}</span>

                  <span className='property-name'>Method Type</span>
                  <span className='property-value'>{waterRightDetails.methodType}</span>

                  <span className='property-name'>Method Link</span>
                  <span className='property-value'>{waterRightDetails.methodLink}</span>

                  <span className='property-name'>Method Description</span>
                  <span className='property-value'>{waterRightDetails.methodDescription}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>}
    </div>
  )
}

export default WaterRightProperties;