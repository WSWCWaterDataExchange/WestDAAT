using NetTopologySuite.Geometries;

namespace WesternStatesWater.WestDaat.Tests.Helpers.Geometry
{
    public class PointFaker : Faker<Point>
    {
        public PointFaker()
        {
            CustomInstantiator(f => new Point(new CoordinateFaker().Generate()));
        }
    }
}
