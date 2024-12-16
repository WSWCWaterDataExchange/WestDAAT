namespace WesternStatesWater.WestDaat.Common.Context
{
    public abstract class ContextBase
    {
        public string AuthToken { get; set; }

        public Guid SessionId { get; set; }

        public int SellerId { get; set; }
    }
}
