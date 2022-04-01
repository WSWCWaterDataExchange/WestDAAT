namespace WesternStatesWater.WestDaat.Common
{
    [Flags]
    public enum NldiDataPoints
    {
        None = 0,
        Wade = 1 << 0,
        Usgs = 1 << 1,
        Epa = 1 << 2
    }
}
