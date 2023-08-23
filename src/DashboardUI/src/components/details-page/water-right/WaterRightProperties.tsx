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
        <Row className="pt-2">
        <Col>
            <Card className="water-rights-card h-100 shadow-sm rounded-3 mb-2">
              <Card.Header>
                <WaterCircle /><span>Water Right Information</span>
              </Card.Header>
              <Card.Body>

                  <Row>
                    <Col>
                      <div className='d-flex p-2 flex-column'>
                        <PropertyValue label='WaDE Water Right Identifier' value={details.allocationUuid} />
                        <PropertyValue label='Native ID' value={details.allocationNativeId} />
                        <PropertyValue label='State Water Right Webpage' value={details.waterAllocationNativeUrl} isUrl={true} />
                        <PropertyValue label='Owner' value={details.allocationOwner} />
                        <PropertyValue label='Owner Classification' value={details.ownerClassificationCV} />
                        <PropertyValue label='Priority Date' value={details.priorityDate} />
                        <PropertyValue label='Assigned Flow (CFS)' value={details.allocationFlowCfs} />
                        <PropertyValue label='Assigned Volume (AF)' value={details.allocationVolumeAF} />
                      </div>
                    </Col>
                    <Col>
                      <div className='d-flex p-2 flex-column'>
                        <span className='property-name'>State Beneficial Use</span>
                        {details.beneficialUses.map(a => <span key={a} className='property-value'>{a}</span>)}

                        <PropertyValue label='WaDE Primary Use Category' value={details.primaryBeneficialUseCategory} />
                        <PropertyValue label='Legal Status' value={details.allocationLegalStatus} />
                        <PropertyValue label='Allocation Timeframe Start' value={details.allocationTimeframeStart} />
                        <PropertyValue label='Allocation Timeframe End' value={details.allocationTimeframeEnd} />
                        <PropertyValue label='WaDE Publication Date' value={details.datePublished} />
                      </div>
                    </Col>
                    <Col>
                    <div className='d-flex p-2 flex-column'>
                        <PropertyValue label='Irrigation Method' value={details.irrigationMethodCV} />
                        <PropertyValue label='Irrigated Acreage' value={details.irrigatedAcreage} />
                        <PropertyValue label='Crop Type' value={details.cropTypeCV} />
                        <PropertyValue label='Allocation Crop Duty (inch)' value={details.allocationCropDutyAmount} />
                        <PropertyValue label='WaDE Irrigation Method' value={details.waDEIrrigationMethod} />
                      </div>
                    </Col>
                  </Row>

              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className='pt-2'>
          <Col className='method-information  col-6'>
            <Card className="water-rights-card h-100 shadow-sm rounded-3 mb-2">
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
          <Col className='managing-organization-agency col-6'>
            <Card className="water-rights-card h-100 shadow-sm rounded-3  mb-2">
              <Card.Header>
                <Domain /><span>Managing Agency</span>
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
        </Row>
      </>}
    </div>
  )
}

export default WaterRightProperties;