namespace WesternStatesWater.WestDaat.Common
{
    [Flags]
    public enum NldiDataPoints
    {
        None           = 0,
        Usgs           = 1 << 0,
        Epa            = 1 << 1,
        WadeRights     = 1 << 2,
        WadeTimeseries = 1 << 3
    }
}
