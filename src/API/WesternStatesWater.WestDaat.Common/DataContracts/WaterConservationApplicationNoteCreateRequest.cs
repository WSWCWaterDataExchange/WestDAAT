namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class WaterConservationApplicationNoteCreateRequest : ApplicationStoreRequestBase
{
    public Guid WaterConservationApplicationId { get; set; }
    
    public Guid CreatedByUserId { get; set; }
    
    public string Note { get; set; }
}