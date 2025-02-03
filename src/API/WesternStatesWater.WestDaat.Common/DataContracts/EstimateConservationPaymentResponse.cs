namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class EstimateConservationPaymentResponse : CalculateResponseBase
{
    public int EstimatedCompensationDollars { get; set; }

    public double TotalAreaInAcres { get; set; }

    public PolygonSurfaceAreaDetails[] PolygonSurfaceAreaData { get; set; }
}
