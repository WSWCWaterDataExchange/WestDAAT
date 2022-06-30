using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WesternStatesWater.WestDaat.Contracts.Client
{
    public class WaterRightsSearchResults
    {
        public long CurrentPageNumber { get; set; }
        public bool HasMoreResults { get; set; }
        public WaterRightsSearchDetail[] WaterRightsDetails {get; set; }
    }
}
