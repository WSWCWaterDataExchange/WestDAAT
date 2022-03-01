using WesternStatesWater.WestDaat.Engines;
using Microsoft.Extensions.Logging;
using System;
using WesternStatesWater.WestDaat.Accessors;

namespace WesternStatesWater.WestDaat.Managers
{
    public class WaterAllocationManager : ManagerBase, IWaterAllocationManager
    {
        private readonly IWaterAllocationEngine _waterAllocationEngine;
        private readonly ISiteAccessor _siteAccessor;

        public WaterAllocationManager(ISiteAccessor siteAccessor, IWaterAllocationEngine waterAllocationEngine,
            ILogger<WaterAllocationManager> logger) : base(logger)
        {
            _siteAccessor = siteAccessor;
            _waterAllocationEngine = waterAllocationEngine;
        }

        public string GetWaterAllocationSiteDetailsById(string siteUuid)
        {
            var data = _siteAccessor.GetWaterAllocationSiteDetailsById(siteUuid);

            var json = _waterAllocationEngine.BuildGeoconnexJson(data);

            return json;
        }
    }
}