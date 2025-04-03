namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class EstimateConsumptiveUseReviewerRequest : ApplicationStoreRequestBase
{
    public Guid WaterConservationApplicationId { get; set; }

    public MapPolygon[] Polygons { get; set; }

    public MapPoint ControlLocation { get; set; }

    public bool OverwriteEstimate { get; set; }
}
