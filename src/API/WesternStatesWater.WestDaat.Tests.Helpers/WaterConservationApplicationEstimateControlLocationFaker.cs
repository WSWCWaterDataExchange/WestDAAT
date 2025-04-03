namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class WaterConservationApplicationEstimateControlLocationFaker : Faker<EFWD.WaterConservationApplicationEstimateControlLocation>
{
    public WaterConservationApplicationEstimateControlLocationFaker(EFWD.WaterConservationApplicationEstimate estimate = null)
    {
        const int minLongitude = -180,
                  maxLongitude = 180,
                  minLatitude = -90,
                  maxLatitude = 90;

        RuleFor(wcaep => wcaep.PointWkt, f => $"POINT ({f.Random.Double(minLongitude, maxLongitude)} {f.Random.Double(minLatitude, maxLatitude)})");

        if (estimate != null)
        {
            RuleFor(wcaep => wcaep.Estimate, () => estimate);
        }
    }
}
