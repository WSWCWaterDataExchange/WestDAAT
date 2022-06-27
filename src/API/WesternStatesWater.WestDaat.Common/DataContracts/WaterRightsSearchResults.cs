using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WesternStatesWater.WestDaat.Common.DataContracts
{
    public class WaterRightsSearchResults
    {
        public long CurrentPageNumber { get; set; }
        public WaterRightsSearchDetail[] WaterRightsDetails { get; set; }
    }
}
