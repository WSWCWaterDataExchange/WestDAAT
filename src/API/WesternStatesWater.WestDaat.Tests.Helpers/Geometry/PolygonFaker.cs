using Bogus;
using NetTopologySuite.Geometries;

namespace WesternStatesWater.WestDaat.Tests.Helpers.Geometry
{
    public class PolygonFaker : Faker<Polygon>
    {
        public PolygonFaker()
        {
            CustomInstantiator(f => new Polygon(new LinearRing(GenerateRandomCoordinates(f))));
        }

        private Coordinate[] GenerateRandomCoordinates(Faker faker)
        {
            var coordinates = PolySort(new CoordinateFaker().Generate(faker.Random.Int(3, 10)));
            coordinates.Add(coordinates[0]); //last point needs to be the first point to close the polygon
            return coordinates.ToArray();
        }

        //based on https://stackoverflow.com/a/59293807/4552551 to generate valid polygons
        private List<Coordinate> PolySort(List<Coordinate> points)
        {
            // Get "centre of mass"
            var centre = new Coordinate(points.Sum(a => a.X) / points.Count, points.Sum(a => a.Y) / points.Count);

            // Sort by polar angle and distance, centered at this centre of mass.
            return points.Select(a => new { point = a, squaredPolar = SquaredPolar(a, centre) })
                         .OrderBy(a => a.squaredPolar.angle)
                         .ThenBy(a => a.squaredPolar.distance)
                         .Select(a => a.point)
                         .ToList();
        }

        private (double angle, double distance) SquaredPolar(Coordinate coordinate, Coordinate centre)
        {
            return (
                Math.Atan2(coordinate.Y - centre.Y, coordinate.X - centre.X),
                Math.Pow(coordinate.X - centre.X, 2) + Math.Pow(coordinate.Y - centre.Y, 2)
            );
        }
    }
}
