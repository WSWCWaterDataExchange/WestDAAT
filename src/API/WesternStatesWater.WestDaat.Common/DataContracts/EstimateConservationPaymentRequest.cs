namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class EstimateConservationPaymentRequest : CalculateRequestBase
{
    public PolygonEtDataCollection[] DataCollections { get; set; }

    public double CompensationRateDollars { get; set; }

    public CompensationRateUnits CompensationRateUnits { get; set; }
}
