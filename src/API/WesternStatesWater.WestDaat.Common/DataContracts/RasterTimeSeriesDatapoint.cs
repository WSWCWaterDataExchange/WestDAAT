using System.Text.Json.Serialization;

namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class RasterTimeSeriesDatapoint
{
    [JsonPropertyName("time")]
    public DateOnly Time { get; set; }

    [JsonPropertyName("et")]
    public double Evapotranspiration { get; set; }
}
