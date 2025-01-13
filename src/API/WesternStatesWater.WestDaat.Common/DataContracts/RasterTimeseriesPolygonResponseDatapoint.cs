using System.Text.Json.Serialization;

namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class RasterTimeseriesPolygonResponseDatapoint
{
    [JsonPropertyName("time")]
    public DateOnly Time { get; set; }

    [JsonPropertyName("et")]
    public double Evapotranspiration { get; set; }
}
