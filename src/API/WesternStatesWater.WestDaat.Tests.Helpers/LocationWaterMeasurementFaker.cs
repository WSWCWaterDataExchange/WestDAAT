namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class LocationWaterMeasurementFaker : Faker<EFWD.LocationWaterMeasurement>
{
    public LocationWaterMeasurementFaker(EFWD.WaterConservationApplicationEstimateLocation location = null)
    {
        RuleFor(x => x.Year, f => f.Date.Past(5, DateTime.UtcNow).Year);

        RuleFor(x => x.TotalEtInInches, f => f.Random.Number(10, 100));

        RuleFor(x => x.EffectivePrecipitationInInches, f => f.Random.Number(1, 10));

        RuleFor(x => x.NetEtInInches, (f, x) => x.TotalEtInInches - x.EffectivePrecipitationInInches);

        if (location != null)
        {
            RuleFor(x => x.Location, () => location);
        }
    }
}
