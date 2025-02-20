namespace WesternStatesWater.WestDaat.Common.DataContracts;

public enum RasterTimeSeriesModel
{
    None = 0,
    SSEBop = 1,
    DisALEXI = 2,
#pragma warning disable SA1300 // Element should begin with upper-case letter
    eeMETRIC = 3,
    geeSEBAL = 4,
#pragma warning restore SA1300 // Element should begin with upper-case letter
    Ensemble = 5,
    PTJPL = 6
}
