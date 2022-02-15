using System;

namespace WesternStatesWater.WaDE.Common
{
    public class AmbientContext
    {
        public string AuthToken { get; set; }

        public Guid SessionId { get; set; }

        public int SellerId { get; set; }
    }
}
