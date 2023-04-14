import { Card, Col, Row } from 'react-bootstrap';
import { useWaterRightDetails } from '../hooks/useWaterRightQuery';
import Domain from 'mdi-react/DomainIcon';
// import FormatListBulleted from 'mdi-react/FormatListBulletedIcon';
import ClipBoardSearch from 'mdi-react/ClipboardSearchIcon';
import { FormattedDate } from './FormattedDate';

interface waterRightPropertiesProps {
  allocationUuid: string;
}

function WaterRightProperties(props: waterRightPropertiesProps) {
  // TODO: Update with loading screen after Dub update
  const waterRightDetails = useWaterRightDetails(props.allocationUuid).data;

  const getPropertyValueClass = (value: any) => {
    return value !== null ? 'property-value' : 'property-value empty';
  }
  const emptyValue = 'Unknown';

  const getDateString = (date: Date) => {
    if (date) {
      return <FormattedDate>{date}</FormattedDate>;
    }
    return emptyValue;
  }

  const formatUrl = (url: string) => {
    if(!url) {
      return emptyValue;
    }

    return <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>;
  }

  const formatWaterAllocationNativeUrl = (url: string) => {
    if(!url) {
      return ( <><span className='property-name'>State Water Right Webpage</span><span className='property-value empty'>Unavailable</span></> );
    }

    return <span className='property-value'><a href={url} target="_blank" rel="noopener noreferrer">State Water Right Webpage</a></span>;
  }

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
                  <span className={getPropertyValueClass(waterRightDetails.organizationWebsite)}>{formatUrl(waterRightDetails.organizationWebsite)}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
          {/* <Col>
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
          </Col> */}
          <Col>
            <Card className="h-100 shadow-sm rounded-3">
              <Card.Header className="water-rights-header"> <ClipBoardSearch></ClipBoardSearch> Water Right Information</Card.Header>
              <Card.Body>
                <div className='d-flex p-2 flex-column'>
                  <span className='property-name'>WaDE Water Right Identifier</span>
                  <span className={getPropertyValueClass(waterRightDetails.allocationUuid)}>{waterRightDetails.allocationUuid || emptyValue}</span>

                  <span className='property-name'>Native ID</span>
                  <span className={getPropertyValueClass(waterRightDetails.allocationNativeId)}>{waterRightDetails.allocationNativeId || emptyValue}</span>

                  { formatWaterAllocationNativeUrl(waterRightDetails.waterAllocationNativeUrl) }

                  <span className='property-name'>Owner</span>
                  <span className={getPropertyValueClass(waterRightDetails.allocationOwner)}>{waterRightDetails.allocationOwner || emptyValue}</span>

                  <span className='property-name'>Priority Date</span>
                  <span className={getPropertyValueClass(waterRightDetails.priorityDate)}>{getDateString(waterRightDetails.priorityDate)}</span>

                  <span className='property-name'>Expiration Date</span>
                  <span className={getPropertyValueClass(waterRightDetails.expirationDate)}>{getDateString(waterRightDetails.expirationDate)} </span>

                  <span className='property-name'>Legal Status</span>
                  <span className={getPropertyValueClass(waterRightDetails.allocationLegalStatus)}>{waterRightDetails.allocationLegalStatus || emptyValue}</span>

                  <span className='property-name'>Assigned Flow (CFS)</span>
                  <span className={getPropertyValueClass(waterRightDetails.allocationFlowCfs)}>{waterRightDetails.allocationFlowCfs?.toLocaleString() || emptyValue}</span>

                  <span className='property-name'>Assigned Volume (AF)</span>
                  <span className={getPropertyValueClass(waterRightDetails.allocationVolumeAF)}>{waterRightDetails.allocationVolumeAF?.toLocaleString() || emptyValue}</span>

                  <span className='property-name'>Beneficial Use</span>
                  {waterRightDetails.beneficialUses.map(a => <span key={a} className='property-value'>{a}</span>)}

                  <span className='property-name'>WaDE Primary Use Category</span>
                  <span className={getPropertyValueClass(waterRightDetails.primaryBeneficialUseCategory)}>{waterRightDetails.primaryBeneficialUseCategory || emptyValue}</span>
                  
                  <span className='property-name'>Date Published</span>
                  <span className={getPropertyValueClass(waterRightDetails.datePublished)}>{getDateString(waterRightDetails.datePublished)}</span>

                  <span className='property-name'>Allocation Timeframe Start</span>
                  <span className={getPropertyValueClass(waterRightDetails.allocationTimeframeStart)}>{waterRightDetails.allocationTimeframeStart || emptyValue}</span>

                  <span className='property-name'>Allocation Timeframe End</span>
                  <span className={getPropertyValueClass(waterRightDetails.allocationTimeframeEnd)}>{waterRightDetails.allocationTimeframeEnd || emptyValue}</span>

                  <span className='property-name'>Allocation Crop Duty (inch)</span>
                  <span className={getPropertyValueClass(waterRightDetails.allocationCropDutyAmount)}>{waterRightDetails.allocationCropDutyAmount?.toLocaleString() || emptyValue}</span>
                  
                  <span className='property-name'>Owner Classification</span>
                  <span className={getPropertyValueClass(waterRightDetails.ownerClassificationCV)}>{waterRightDetails.ownerClassificationCV || emptyValue}</span>

                  <span className='property-name'>Irrigation Method</span>
                  <span className={getPropertyValueClass(waterRightDetails.irrigationMethodCV)}>{waterRightDetails.irrigationMethodCV || emptyValue}</span>

                  <span className='property-name'>Irrigated Acreage</span>
                  <span className={getPropertyValueClass(waterRightDetails.irrigatedAcreage)}>{waterRightDetails.irrigatedAcreage || emptyValue}</span>

                  <span className='property-name'>Crop Type</span>
                  <span className={getPropertyValueClass(waterRightDetails.cropTypeCV)}>{waterRightDetails.cropTypeCV || emptyValue}</span>

                  <span className='property-name'>WaDE Irrigation Method</span>
                  <span className={getPropertyValueClass(waterRightDetails.waDEIrrigationMethod)}>{waterRightDetails.waDEIrrigationMethod || emptyValue}</span>
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
                  <span className={getPropertyValueClass(waterRightDetails.applicableResourceType)}>{waterRightDetails.applicableResourceType || emptyValue}</span>

                  <span className='property-name'>Method Type</span>
                  <span className={getPropertyValueClass(waterRightDetails.methodType)}>{waterRightDetails.methodType || emptyValue}</span>

                  <span className='property-name'>Method Link</span>
                  <span className={getPropertyValueClass(waterRightDetails.methodLink)}>{formatUrl(waterRightDetails.methodLink)}</span>

                  <span className='property-name'>Method Description</span>
                  <span className={`fw-normal ${getPropertyValueClass(waterRightDetails.methodDescription)}`}>{waterRightDetails.methodDescription || emptyValue}</span>
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