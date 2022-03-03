namespace WesternStatesWater.WestDaat.Common.Contracts
{
    [Flags]
    public enum NldiDirections
    {
        None = 0,
        Upsteam = 1 << 0,
        Downsteam = 1 << 1
    }
}
