using System.Text.Json.Serialization;

namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class RasterTimeSeriesPolygonResponseDatapoint
{
    [JsonPropertyName("time")]
    public DateOnly Time { get; set; }

    [JsonPropertyName("et")]
    public double Evapotranspiration { get; set; }
}
