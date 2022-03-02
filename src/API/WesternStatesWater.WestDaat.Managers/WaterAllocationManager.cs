using WesternStatesWater.WestDaat.Engines;
using Microsoft.Extensions.Logging;
using System;
using WesternStatesWater.WestDaat.Accessors;

namespace WesternStatesWater.WestDaat.Managers
{
    public class WaterAllocationManager : ManagerBase, IWaterAllocationManager
    {
        private readonly IGeoConnexEngine _geoConnexEngine;
        private readonly ISiteAccessor _siteAccessor;

        public WaterAllocationManager(ISiteAccessor siteAccessor, IGeoConnexEngine geoConnexEngine,
            ILogger<WaterAllocationManager> logger) : base(logger)
        {
            _siteAccessor = siteAccessor;
            _geoConnexEngine = geoConnexEngine;
        }

        public string GetWaterAllocationSiteDetailsById(string siteUuid)
        {
            var data = _siteAccessor.GetWaterAllocationSiteDetailsById(siteUuid);

            var json = _geoConnexEngine.BuildGeoconnexJson(data);

            return json;
        }
    }
}