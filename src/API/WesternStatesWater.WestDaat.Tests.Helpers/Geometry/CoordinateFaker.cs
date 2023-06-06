using NetTopologySuite.Geometries;

namespace WesternStatesWater.WestDaat.Tests.Helpers.Geometry
{
    public class CoordinateFaker : Faker<Coordinate>
    {
        //roughly western continental us
        const int EasternMostLongitude = -94,
                  WesternMostLongitude = -124,
                  NorthernMostLatitude = 48,
                  SouthernMostLatitude = 26;
        public CoordinateFaker()
        {
            CustomInstantiator(f => new Coordinate(f.Random.Double(WesternMostLongitude, EasternMostLongitude), f.Random.Double(SouthernMostLatitude, NorthernMostLatitude)));
        }
    }
}
