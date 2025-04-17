using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class WaterConservationApplicationApprovalRequest : ApplicationStoreRequestBase
{
    public Guid WaterConservationApplicationId { get; set; }
    
    public ApprovalDecision ApprovalDecision { get; set; }
    
    public string ApprovalNotes { get; set; }
}