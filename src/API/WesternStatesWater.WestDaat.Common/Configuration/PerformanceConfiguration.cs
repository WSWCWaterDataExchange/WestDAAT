using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WesternStatesWater.WestDaat.Common.Configuration
{
    public class PerformanceConfiguration
    {
        public int WaterRightsSearchPageSize { get; set; }
        public int MaxRecordsDownload { get; set; }
        public int DownloadCommandTimeout { get; set; }
    }
}
