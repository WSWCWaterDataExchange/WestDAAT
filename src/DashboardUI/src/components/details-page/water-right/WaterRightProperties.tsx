import { Card, Col, Row } from 'react-bootstrap';
import Domain from 'mdi-react/DomainIcon';
import ClipBoardSearch from 'mdi-react/ClipboardSearchIcon';
import WaterCircle from 'mdi-react/WaterCircleIcon';
import { PropertyValue } from '../PropertyValue';
import { useWaterRightDetailsContext } from './Provider';

function WaterRightProperties() {
  const { hostData: { detailsQuery: {data: details}}} = useWaterRightDetailsContext()
  return (
    <div>
      {details && <>
        <Row className="pt-4">
          <Col>
            <Card className="water-rights-card h-100 shadow-sm rounded-3">
              <Card.Header>
                <Domain /><span>Managing Organization Agency</span>
              </Card.Header>
              <Card.Body>
                <div className='d-flex p-2 flex-column'>
                  <PropertyValue label='Organization Name' value={details.organizationName} />
                  <PropertyValue label='State' value={details.state} />
                  <PropertyValue label='Website' value={details.organizationWebsite} isUrl={true} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="water-rights-card h-100 shadow-sm rounded-3">
              <Card.Header>
                <WaterCircle /><span>Water Right Information</span>
              </Card.Header>
              <Card.Body>
                <div className='d-flex p-2 flex-column'>
                  <PropertyValue label='WaDE Water Right Identifier' value={details.allocationUuid} />
                  <PropertyValue label='Native ID' value={details.allocationNativeId} />
                  <PropertyValue label='State Water Right Webpage' value={details.waterAllocationNativeUrl} isUrl={true} />
                  <PropertyValue label='Owner' value={details.allocationOwner} />
                  <PropertyValue label='Priority Date' value={details.priorityDate} />
                  <PropertyValue label='Expiration Date' value={details.expirationDate} />
                  <PropertyValue label='Legal Status' value={details.allocationLegalStatus} />
                  <PropertyValue label='Assigned Flow (CFS)' value={details.allocationFlowCfs} />
                  <PropertyValue label='Assigned Volume (AF)' value={details.allocationVolumeAF} />
                  
                  <span className='property-name'>Beneficial Use</span>
                  {details.beneficialUses.map(a => <span key={a} className='property-value'>{a}</span>)}

                  <PropertyValue label='WaDE Primary Use Category' value={details.primaryBeneficialUseCategory} />
                  <PropertyValue label='Date Published' value={details.datePublished} />
                  <PropertyValue label='Allocation Timeframe Start' value={details.allocationTimeframeStart} />
                  <PropertyValue label='Allocation Timeframe End' value={details.allocationTimeframeEnd} />
                  <PropertyValue label='Allocation Crop Duty (inch)' value={details.allocationCropDutyAmount} />
                  <PropertyValue label='Owner Classification' value={details.ownerClassificationCV} />
                  <PropertyValue label='Irrigation Method' value={details.irrigationMethodCV} />
                  <PropertyValue label='Irrigated Acreage' value={details.irrigatedAcreage} />
                  <PropertyValue label='Crop Type' value={details.cropTypeCV} />
                  <PropertyValue label='WaDE Irrigation Method' value={details.waDEIrrigationMethod} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="water-rights-card h-100 shadow-sm rounded-3">
              <Card.Header>
                <ClipBoardSearch /><span>Method Information</span>
              </Card.Header>
              <Card.Body>
                <div className='d-flex p-2 flex-column'>
                  <PropertyValue label='Applicable Resource Type' value={details.applicableResourceType} />
                  <PropertyValue label='Method Type' value={details.methodType} />
                  <PropertyValue label='Method Link' value={details.methodLink} isUrl={true} />
                  <PropertyValue label='WaDE Data Mapping Process' value={details.waDEDataMappingUrl} isUrl={true} />
                  <PropertyValue label='Method Description' value={details.methodDescription} isVerbose={true} />
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