using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class WaterConservationApplicationRecommendationRequest : ApplicationStoreRequestBase
{
    public Guid WaterConservationApplicationId { get; set; }
    
    public RecommendationDecision RecommendationDecision { get; set; }

    public string RecommendationNotes { get; set; }
}