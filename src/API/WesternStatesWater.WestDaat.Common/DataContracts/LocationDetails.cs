namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class LocationDetails
{
    public Guid Id { get; set; }

    public string PolygonWkt { get; set; } = null!;

    public DrawToolType DrawToolType { get; set; }

    public double PolygonAreaInAcres { get; set; }

    public string AdditionalDetails { get; set; } = null!;

    public double AverageYearlyTotalEtInInches { get; set; }

    public double AverageYearlyTotalEtInAcreFeet { get; set; }

    public double? AverageYearlyNetEtInInches { get; set; }

    public double? AverageYearlyNetEtInAcreFeet { get; set; }

    public LocationWaterMeasurementDetails[] WaterMeasurements { get; set; } = null!;
}
