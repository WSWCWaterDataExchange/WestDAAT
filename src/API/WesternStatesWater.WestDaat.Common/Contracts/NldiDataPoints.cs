namespace WesternStatesWater.WestDaat.Common.Contracts
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
