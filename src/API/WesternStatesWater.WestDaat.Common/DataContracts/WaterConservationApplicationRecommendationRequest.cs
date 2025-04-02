namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class WaterConservationApplicationRecommendationRequest : ApplicationStoreRequestBase
{
    public Guid WaterConservationApplicationId { get; set; }
    
    public Guid RecommendedByUserId { get; set; }
    
    public RecommendationDecision RecommendationDecision { get; set; }
    
    public string RecommendationNotes { get; set; }
}