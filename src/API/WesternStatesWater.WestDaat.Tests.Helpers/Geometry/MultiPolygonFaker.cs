using NetTopologySuite.Geometries;

namespace WesternStatesWater.WestDaat.Tests.Helpers.Geometry
{
    public class MultiPolygonFaker : Faker<MultiPolygon>
    {
        public MultiPolygonFaker()
        {
            CustomInstantiator(f => new MultiPolygon(GeneratePolygons(f, 0)));
        }

        private Polygon[] GeneratePolygons(Faker faker, int attemptCount)
        {
            if (attemptCount > 100)
            {
                throw new InvalidOperationException("Unable to generate MultiPolygon");
            }
            List<Polygon> polygons = new();
            int polygonCount = faker.Random.Int(2, 10);
            var internalAttemptCount = 0;
            while (polygons.Count < polygonCount && internalAttemptCount < 50)
            {
                var newPolygon = new PolygonFaker().Generate();
                if (polygons.All(a => !a.Intersects(newPolygon)))
                {
                    polygons.Add(newPolygon);
                    internalAttemptCount = 0;
                }
                else
                {
                    internalAttemptCount++;
                }
            }
            if (polygons.Count == polygonCount)
            {
                return polygons.ToArray();
            }
            return GeneratePolygons(faker, attemptCount + 1);
        }
    }
}
