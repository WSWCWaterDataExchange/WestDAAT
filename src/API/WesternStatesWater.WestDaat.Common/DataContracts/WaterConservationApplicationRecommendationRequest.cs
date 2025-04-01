namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class WaterConservationApplicationRecommendationRequest : ApplicationStoreRequestBase
{
    public Guid WaterConservationApplicationId { get; set; }
    
    public Guid RecommendedByUserId { get; set; }
    
    public bool IsRecommended { get; set; }
    
    public string RecommendationNotes { get; set; }
}