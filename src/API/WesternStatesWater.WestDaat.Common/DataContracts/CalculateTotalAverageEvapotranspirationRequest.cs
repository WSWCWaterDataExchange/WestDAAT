namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class CalculateTotalAverageEvapotranspirationRequest
{
    public RasterTimeSeriesPolygonResponseDatapoint[][] EtDataPointsGroupedByPolygon { get; set; }
}
