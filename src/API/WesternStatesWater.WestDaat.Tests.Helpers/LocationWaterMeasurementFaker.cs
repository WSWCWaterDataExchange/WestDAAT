namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class LocationWaterMeasurementFaker : Faker<EFWD.LocationWaterMeasurement>
{
    public LocationWaterMeasurementFaker(EFWD.WaterConservationApplicationEstimateLocation location = null)
    {
        RuleFor(wcaelcu => wcaelcu.Year, f => f.Date.Past(5, DateTime.UtcNow).Year);

        RuleFor(wcaelcu => wcaelcu.TotalEtInInches, f => f.Random.Number(10, 1000));

        if (location != null)
        {
            RuleFor(wcaelcu => wcaelcu.Location, () => location);
        }
    }
}
