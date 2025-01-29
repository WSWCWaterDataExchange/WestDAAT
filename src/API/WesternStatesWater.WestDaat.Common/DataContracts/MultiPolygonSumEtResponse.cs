namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class MultiPolygonSumEtResponse : CalculateResponseBase
{
    /// <summary>
    /// OpenET returns ET values in inches with a couple decimal places.
    /// </summary>
    public double TotalEtInInches { get; set; }
}
