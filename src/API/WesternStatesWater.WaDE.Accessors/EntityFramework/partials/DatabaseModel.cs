using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace WesternStatesWater.WaDE.Accessors.EntityFramework
{
    public abstract class DatabaseModel
    {
        public long Id { get; set; }
    }
}
