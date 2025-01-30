using GeoJSON.Text.Feature;
using GeoJSON.Text.Geometry;
using Microsoft.SqlServer.Types;
using NetTopologySuite;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO;
using Newtonsoft.Json;
using System.Data.SqlTypes;
using System.IO;

namespace WesternStatesWater.WestDaat.Utilities
{
    public static class GeometryHelpers
    {
        public static IGeometryObject AsGeoJsonGeometry(this Geometry geometry)
        {
            if (geometry == null)
            {
                return null;
            }
            var serializer = GeoJsonSerializer.Create();
            using var stringWriter = new StringWriter();
            using var jsonWriter = new JsonTextWriter(stringWriter);
            serializer.Serialize(jsonWriter, geometry);
            return System.Text.Json.JsonSerializer.Deserialize<IGeometryObject>(stringWriter.ToString());
        }

        //Json can start with lots of characters but I _believe_ GeoJson can only start with "{"
        private static readonly string[] GeoJsonStartingCharacters = new[] { "{" };

        public static Geometry GetGeometry(string geometry)
        {
            if (string.IsNullOrWhiteSpace(geometry))
            {
                return null;
            }
            if (IsGeoJsonString(geometry))
            {
                //We are assuming it is GeoJson but it might not be well formatted
                return GetGeometryByGeoJson(geometry);
            }
            return GetGeometryByWkt(geometry);

        }

        public static Geometry GetGeometryByWkt(string wkt)
        {
            if (string.IsNullOrWhiteSpace(wkt))
            {
                return null;
            }
            var reader = new WKTReader(new NtsGeometryServices(PrecisionModel.Floating.Value, 4326));
            return reader.Read(wkt);
        }

        public static Geometry GetGeometryByGeoJson(string geoJson)
        {
            if (string.IsNullOrWhiteSpace(geoJson))
            {
                return null;
            }
            var serializer = GeoJsonSerializer.Create();
            using var stringReader = new StringReader(geoJson);
            using var jsonReader = new JsonTextReader(stringReader);
            return serializer.Deserialize<Geometry>(jsonReader);
        }

        public static Geometry[] GetGeometryByFeatures(List<Feature> features)
        {
            var extract = new List<Geometry>();

            foreach (var feature in features)
            {
                var json = System.Text.Json.JsonSerializer.Serialize(feature.Geometry);
                extract.Add(GetGeometryByGeoJson(json));
            }

            return extract.ToArray();
        }

        private static bool IsGeoJsonString(string geometry)
        {
            return GeoJsonStartingCharacters.Any(geometry.TrimStart().StartsWith);
        }

        public static double GetGeometryAreaInSquareMeters(Geometry geometry)
        {
            if (geometry == null)
            {
                throw new ArgumentException($"{nameof(geometry)} cannot be null");
            }

            if (geometry.SRID != 4326)
            {
                throw new ArgumentException($"Unsupported geometry SRID {geometry.SRID}");
            }

            return geometry.ToSqlGeography().STArea().Value;
        }

        private static SqlGeography ToSqlGeography(this Geometry geometry)
        {
            var chars = new SqlChars(geometry.ToString());
            var sqlGeometry = SqlGeography.STGeomFromText(chars, geometry.SRID);
            return sqlGeometry.MakeValid();
        }
    }
}
