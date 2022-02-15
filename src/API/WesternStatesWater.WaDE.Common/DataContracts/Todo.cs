using System;

namespace WesternStatesWater.WaDE.Common.DataContracts
{
    public class Todo
    {
        public string Id { get; set; }

        public string Message { get; set; }

        public DateTimeOffset CreatedDate { get; set; }
    }
}
