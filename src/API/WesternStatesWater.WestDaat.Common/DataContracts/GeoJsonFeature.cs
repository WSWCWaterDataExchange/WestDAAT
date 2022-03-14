using System.Text.Json.Serialization;

namespace WesternStatesWater.WestDaat.Common.DataContracts
{
    // https://geojson.org/schema/Feature.json
    public class GeoJsonFeature
    {
        [JsonPropertyName("type")]
        public string Type { get; private set; } = "Feature";

        [JsonPropertyName("geometry")]
        public GeoJsonGeometry Geometry { get; set; }

        [JsonPropertyName("properties")]
        public Dictionary<string, object> Properties { get; set; }
    }
}
