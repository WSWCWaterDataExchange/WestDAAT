namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class WaterConservationApplicationEstimateLocationFaker : Faker<EFWD.WaterConservationApplicationEstimateLocation>
{
    public WaterConservationApplicationEstimateLocationFaker(EFWD.WaterConservationApplicationEstimate estimate = null)
    {
        var polygonWktExamples = new string[]
        {
            "POLYGON ((0 0, 1 0, 1 1, 0 1, 0 0))", // square
            "POLYGON ((0 0, 4 0, 4 4, 0 4, 0 0), (1 1, 1 2, 2 2, 2 1, 1 1))", // square with a square hole
            "POLYGON ((-64.8 32.3, -65.5 18.3, -80.3 25.2, -64.8 32.3))" // triangle
        };

        RuleFor(wcaep => wcaep.PolygonWkt, f => f.PickRandom(polygonWktExamples));

        RuleFor(wcael => wcael.PolygonAreaInAcres, f => f.Random.Number(10, 1000));

        RuleFor(wcael => wcael.AdditionalDetails, f => f.Lorem.Sentence());

        RuleFor(wcael => wcael.PolygonType, f => f.PickRandomWithout(Common.DataContracts.PolygonType.Unknown));

        if (estimate != null)
        {
            RuleFor(wcaep => wcaep.Estimate, () => estimate);
        }
    }
}
