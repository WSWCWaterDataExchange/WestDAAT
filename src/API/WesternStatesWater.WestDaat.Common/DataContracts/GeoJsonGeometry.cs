using System.Text.Json.Serialization;

namespace WesternStatesWater.WestDaat.Common.DataContracts
{
    public class GeoJsonGeometry
    {
        [JsonPropertyName("type")]
        public string Type { get; set; }

        [JsonPropertyName("coordinates")]
        public double[] Coordinates { get; set; }
    }
}