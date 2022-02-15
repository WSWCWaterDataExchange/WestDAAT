using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace WesternStatesWater.WaDE.Accessors.EntityFramework
{
    public class Todo : DatabaseModel
    {
        public string Message { get; set; }

        public DateTimeOffset CreatedDate { get; set; }
    }
}
