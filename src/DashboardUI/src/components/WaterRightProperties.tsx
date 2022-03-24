import { useWaterRightDetails } from '../hooks/waterAllocation';

interface waterRightPropertiesProps {
    waterRightId: string;
}

function WaterRightProperties(props: waterRightPropertiesProps){
  // TODO: Update with loading screen after Dub update
  const waterRightDetails = useWaterRightDetails(+props.waterRightId).data;

  return (
  <div className='d-flex flex-row'>
    {waterRightDetails && <>
      <div className='d-flex p-2 flex-column'>
        <h4>Water Right Info</h4>
        <span className='property-name'>WaDE ID</span>
        <span className='property-value'>{waterRightDetails.allocationAmountId}</span>
        
        <span className='property-name'>Native ID</span>
        <span className='property-value'>{waterRightDetails.allocationNativeId}</span>
        
        <span className='property-name'>Owner</span>
        <span className='property-value'>{waterRightDetails.allocationOwner}</span>
        
        <span className='property-name'>Priority Date</span>
        <span className='property-value'>{waterRightDetails.priorityDate}</span>
        
        <span className='property-name'>Expiration Date</span>
        <span className='property-value'>{waterRightDetails.expirationDate}</span>
        
        <span className='property-name'>Legal Status</span>
        <span className='property-value'>{waterRightDetails.allocationLegalStatus}</span>
        
        <span className='property-name'>Assigned Flow (CFS)</span>
        <span className='property-value'>{waterRightDetails.allocationFlowCfs}</span>
        
        <span className='property-name'>Assigned Volume (AF)</span>
        <span className='property-value'>{waterRightDetails.allocationVolumeAF}</span>

        <span className='property-name'>Beneficial Use</span>
        <span className='property-value'>{waterRightDetails.beneficialUse}</span>
      </div>
      <div className='d-flex p-2 flex-column'>
        <h4>Variable</h4>
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
      <div className='d-flex p-2 flex-column'>
        <h4>Organization</h4>
        <span className='property-name'>Organization Name</span>
        <span className='property-value'>{waterRightDetails.organizationName}</span>
        
        <span className='property-name'>State</span>
        <span className='property-value'>{waterRightDetails.state}</span>
        
        <span className='property-name'>Contact Name</span>
        <span className='property-value'>{waterRightDetails.organizationContactName}</span>
        
        <span className='property-name'>Contact Email</span>
        <span className='property-value'><a href={`mailto:${waterRightDetails.organizationContactEmail}`}>{waterRightDetails.organizationContactEmail}</a></span>
        
        <span className='property-name'>Phone Number</span>
        <span className='property-value'>{waterRightDetails.organizationPhoneNumber}</span>
        
        <span className='property-name'>Website</span>
        <span className='property-value'><a href={waterRightDetails.organizationWebsite}>{waterRightDetails.organizationWebsite}</a></span>
      </div>
    </>}
  </div>
  )
}

export default WaterRightProperties;