import { Card, Col, Row } from 'react-bootstrap';
import { useWaterRightDetails } from '../hooks/useWaterRightQuery';
import Domain from 'mdi-react/DomainIcon';
import ClipBoardSearch from 'mdi-react/ClipboardSearchIcon';
import WaterCircle from 'mdi-react/WaterCircleIcon';
import { FormattedDate } from './FormattedDate';

interface waterRightPropertiesProps {
  allocationUuid: string;
}

function WaterRightProperties(props: waterRightPropertiesProps) {
  // TODO: Update with loading screen after Dub update
  const waterRightDetails = useWaterRightDetails(props.allocationUuid).data;

  const buildPropertyElements = (label: string, value: string | number | JSX.Element, isVerbose: boolean = false) => {
    return <>
        <span className='property-name'>{label}</span>
        <span className={`property-value${isVerbose ? ' is-verbose' : ''}`}>{value}</span>
    </>
  }

  const getDateString = (date: Date) => {
    return date && <FormattedDate>{date}</FormattedDate>;
  }

  const buildPropertyUrlElements = (title: string, url: string) => {
    return <>
      <span className='property-name'>{title}</span>
      <span className='property-value'>{url && <a href={url} target="_blank" rel="noopener noreferrer">View</a>}</span>
    </>
  }

  return (
    <div>
      {waterRightDetails && <>
        <Row className="pt-4">
          <Col>
            <Card className="h-100 shadow-sm rounded-3">
              <Card.Header className="water-rights-header"> <Domain /><span>Managing Organization Agency</span></Card.Header>
              <Card.Body>
                <div className='d-flex p-2 flex-column'>
                  {buildPropertyElements('Organization Name', waterRightDetails.organizationName)}
                  {buildPropertyElements('State', waterRightDetails.state)}
                  {buildPropertyUrlElements('Website', waterRightDetails.organizationWebsite)}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="h-100 shadow-sm rounded-3">
              <Card.Header className="water-rights-header"> <WaterCircle /><span>Water Right Information</span></Card.Header>
              <Card.Body>
                <div className='d-flex p-2 flex-column'>
                  {buildPropertyElements('WaDE Water Right Identifier', waterRightDetails.allocationUuid)}
                  {buildPropertyElements('Native ID', waterRightDetails.allocationNativeId)}
                  {buildPropertyUrlElements('State Water Right Webpage', waterRightDetails.waterAllocationNativeUrl)}
                  {buildPropertyElements('Owner', waterRightDetails.allocationOwner)}
                  {buildPropertyElements('Priority Date', getDateString(waterRightDetails.priorityDate))}
                  {buildPropertyElements('Expiration Date', getDateString(waterRightDetails.expirationDate))}
                  {buildPropertyElements('Legal Status', waterRightDetails.allocationLegalStatus)}
                  {buildPropertyElements('Assigned Flow (CFS)', waterRightDetails.allocationFlowCfs)}
                  {buildPropertyElements('Assigned Volume (AF)', waterRightDetails.allocationVolumeAF)}
                  
                  <span className='property-name'>Beneficial Use</span>
                  {waterRightDetails.beneficialUses.map(a => <span key={a} className='property-value'>{a}</span>)}

                  {buildPropertyElements('WaDE Primary Use Category', waterRightDetails.primaryBeneficialUseCategory)}
                  {buildPropertyElements('Date Published', getDateString(waterRightDetails.datePublished))}
                  {buildPropertyElements('Allocation Timeframe Start', waterRightDetails.allocationTimeframeStart)}
                  {buildPropertyElements('Allocation Timeframe End', waterRightDetails.allocationTimeframeEnd)}
                  {buildPropertyElements('Allocation Crop Duty (inch)', waterRightDetails.allocationCropDutyAmount)}
                  {buildPropertyElements('Owner Classification', waterRightDetails.ownerClassificationCV)}
                  {buildPropertyElements('Irrigation Method', waterRightDetails.irrigationMethodCV)}
                  {buildPropertyElements('Irrigated Acreage', waterRightDetails.irrigatedAcreage)}
                  {buildPropertyElements('Crop Type', waterRightDetails.cropTypeCV)}
                  {buildPropertyElements('WaDE Irrigation Method', waterRightDetails.waDEIrrigationMethod)}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="h-100 shadow-sm rounded-3">
              <Card.Header className="water-rights-header"> <ClipBoardSearch /><span>Method Information</span></Card.Header>
              <Card.Body>
                <div className='d-flex p-2 flex-column'>
                  {buildPropertyElements('Applicable Resource Type', waterRightDetails.applicableResourceType)}
                  {buildPropertyElements('Method Type', waterRightDetails.methodType)}
                  {buildPropertyUrlElements('Method Link', waterRightDetails.methodLink)}
                  {buildPropertyElements('Method Description', waterRightDetails.methodDescription, true)}
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