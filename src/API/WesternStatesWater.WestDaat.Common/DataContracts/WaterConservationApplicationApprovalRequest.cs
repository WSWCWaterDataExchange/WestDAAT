namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class WaterConservationApplicationApprovalRequest : ApplicationStoreRequestBase
{
    public Guid WaterConservationApplicationId { get; set; }
    
    public Guid ApprovedByUserId { get; set; }
    
    public ApprovalDecision ApprovalDecision { get; set; }
    
    public string ApprovalNotes { get; set; }
}