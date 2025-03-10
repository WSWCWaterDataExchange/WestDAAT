namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class WaterConservationApplicationEstimateLocationConsumptiveUseFaker : Faker<EFWD.WaterConservationApplicationEstimateLocationConsumptiveUse>
{
    public WaterConservationApplicationEstimateLocationConsumptiveUseFaker(EFWD.WaterConservationApplicationEstimateLocation location = null)
    {
        RuleFor(wcaelcu => wcaelcu.Year, f => f.Date.Past(5, DateTime.UtcNow).Year);

        RuleFor(wcaelcu => wcaelcu.EtInInches, f => f.Random.Number(10, 1000));

        if (location != null)
        {
            RuleFor(wcaelcu => wcaelcu.Location, () => location);
        }
    }
}
