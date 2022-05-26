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

  const notEmpty = (value: any) => {
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
                  <span className={notEmpty(waterRightDetails.organizationName)}>{waterRightDetails.organizationName || emptyValue}</span>

                  <span className='property-name'>State</span>
                  <span className={notEmpty(waterRightDetails.state)}>{waterRightDetails.state || emptyValue}</span>

                  <span className='property-name'>Website</span>
                  <span className={notEmpty(waterRightDetails.organizationWebsite)}><a href={waterRightDetails.organizationWebsite}>{waterRightDetails.organizationWebsite || emptyValue}</a></span>
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
                  <span className={notEmpty(waterRightDetails.aggregationInterval)}>{waterRightDetails.aggregationInterval || emptyValue}</span>

                  <span className='property-name'>Interval Unit</span>
                  <span className={notEmpty(waterRightDetails.aggregationIntervalUnit)}>{waterRightDetails.aggregationIntervalUnit || emptyValue}</span>

                  <span className='property-name'>Statistic</span>
                  <span className={notEmpty(waterRightDetails.aggregationStatistic)}>{waterRightDetails.aggregationStatistic || emptyValue}</span>

                  <span className='property-name'>Maximum Amount Unit</span>
                  <span className={notEmpty(waterRightDetails.amountUnitCv)}>{waterRightDetails.amountUnitCv || emptyValue}</span>

                  <span className='property-name'>Report Year Start Month</span>
                  <span className={notEmpty(waterRightDetails.reportYearStartMonth)}>{waterRightDetails.reportYearStartMonth || emptyValue}</span>

                  <span className='property-name'>Report Year Type</span>
                  <span className={notEmpty(waterRightDetails.reportYearTypeCv)}>{waterRightDetails.reportYearTypeCv || emptyValue}</span>

                  <span className='property-name'>Variable</span>
                  <span className={notEmpty(waterRightDetails.variableCv)}>{waterRightDetails.variableCv || emptyValue}</span>

                  <span className='property-name'>Variable Specific</span>
                  <span className={notEmpty(waterRightDetails.variableSpecific)}>{waterRightDetails.variableSpecific || emptyValue}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="h-100 shadow-sm rounded-3">
              <Card.Header className="water-rights-header"> <ClipBoardSearch></ClipBoardSearch> Method Information</Card.Header>
              <Card.Body>
                <div className='d-flex p-2 flex-column'>
                  <span className='property-name'>Applicable Resource Type</span>
                  <span className={notEmpty(waterRightDetails.applicableResourceType)}>{waterRightDetails.applicableResourceType || emptyValue}</span>

                  <span className='property-name'>Method Type</span>
                  <span className={notEmpty(waterRightDetails.methodType)}>{waterRightDetails.methodType || emptyValue}</span>

                  <span className='property-name'>Method Link</span>
                  <span className={notEmpty(waterRightDetails.methodLink)}>{waterRightDetails.methodLink || emptyValue}</span>

                  <span className='property-name'>Method Description</span>
                  <span className={'fw-normal' + notEmpty(waterRightDetails.methodDescription)}>{waterRightDetails.methodDescription || emptyValue}</span>
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