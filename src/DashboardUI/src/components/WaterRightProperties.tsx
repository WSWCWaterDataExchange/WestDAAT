import { Card, Col, Row } from 'react-bootstrap';
import { useWaterRightDetails } from '../hooks/useWaterRightQuery';
import Domain from 'mdi-react/DomainIcon';
import FormatListBulleted from 'mdi-react/FormatListBulletedIcon';

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
        </Row>


        {/* <div className='d-flex p-2 flex-column'>
          <h4>Water Right Info</h4>
          <span className='property-name'>WaDE ID</span>
          <span className='property-value'>{waterRightDetails.allocationAmountId}</span>

          <span className='property-name'>Native ID</span>
          <span className='property-value'>{waterRightDetails.allocationNativeId}</span>

          <span className='property-name'>Owner</span>
          <span className='property-value'>{waterRightDetails.allocationOwner}</span>

          <span className='property-name'>Priority Date</span>
          <span className='property-value'><FormattedDate>{waterRightDetails.priorityDate}</FormattedDate></span>

          <span className='property-name'>Expiration Date</span>
          <span className='property-value'><FormattedDate>{waterRightDetails.expirationDate}</FormattedDate></span>

          <span className='property-name'>Legal Status</span>
          <span className='property-value'>{waterRightDetails.allocationLegalStatus}</span>

          <span className='property-name'>Assigned Flow (CFS)</span>
          <span className='property-value'>{waterRightDetails.allocationFlowCfs}</span>

          <span className='property-name'>Assigned Volume (AF)</span>
          <span className='property-value'>{waterRightDetails.allocationVolumeAF}</span>

          <span className='property-name'>Beneficial Use</span>
          {waterRightDetails.beneficialUses.map(a => <span key={a} className='property-value'>{a}</span>)}

        </div> */}

      </>}
    </div>
  )
}

export default WaterRightProperties;