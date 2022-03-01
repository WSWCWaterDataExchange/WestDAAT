using WesternStatesWater.WestDaat.Engines;
using Microsoft.Extensions.Logging;
using System;
using System.Text.Json;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;

namespace WesternStatesWater.WestDaat.Managers
{
    public class WaterAllocationManager : ManagerBase, IWaterAllocationManager
    {
        private readonly ISiteAccessor _siteAccessor;

        public WaterAllocationManager(ISiteAccessor siteAccessor, ILogger<WaterAllocationManager> logger) : base(logger)
        {
            _siteAccessor = siteAccessor;
        }

        public string GetWaterAllocationSiteDetailsById(string siteUuid)
        {
            var data = _siteAccessor.GetWaterAllocationSiteDetailsById(siteUuid);
            var json = JsonSerializer.Serialize(new
            {
                A = data.County,
                B = data.Latitude,
                C = data.Longitude
            });
            return json;
        }
    }
}