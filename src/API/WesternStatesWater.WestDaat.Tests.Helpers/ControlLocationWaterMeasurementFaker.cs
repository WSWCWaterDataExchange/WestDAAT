namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class ControlLocationWaterMeasurementFaker : Faker<EFWD.ControlLocationWaterMeasurement>
{
    public ControlLocationWaterMeasurementFaker(EFWD.WaterConservationApplicationEstimateControlLocation location = null)
    {
        RuleFor(x => x.Year, f => f.Date.Past(5, DateTime.UtcNow).Year);

        RuleFor(x => x.TotalEtInInches, f => f.Random.Number(10, 100));

        if (location != null)
        {
            RuleFor(x => x.Location, () => location);
        }
    }
}
