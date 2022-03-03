namespace WesternStatesWater.WestDaat.Common.Contracts
{
    [Flags]
    public enum NldiDataPoints
    {
        None = 0,
        Wade = 1 << 1,
        Usgs = 1 << 2,
        Epa = 1 << 3
    }
}
