namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class WaterConservationApplicationEstimatePolygonFaker : Faker<EFWD.WaterConservationApplicationEstimateLocation>
{
    public WaterConservationApplicationEstimatePolygonFaker(EFWD.WaterConservationApplicationEstimate estimate = null)
    {
        var polygonWktExamples = new string[]
        {
            "POLYGON ((0 0, 1 0, 1 1, 0 1, 0 0))", // square
            "POLYGON ((0 0, 4 0, 4 4, 0 4, 0 0), (1 1, 1 2, 2 2, 2 1, 1 1))", // square with a square hole
            "POLYGON ((-64.8 32.3, -65.5 18.3, -80.3 25.2, -64.8 32.3))" // triangle
        };

        RuleFor(wcaep => wcaep.PolygonWkt, f => f.PickRandom(polygonWktExamples));

        if (estimate != null)
        {
            RuleFor(wcaep => wcaep.WaterConservationApplicationEstimate, () => estimate);
        }
    }
}
