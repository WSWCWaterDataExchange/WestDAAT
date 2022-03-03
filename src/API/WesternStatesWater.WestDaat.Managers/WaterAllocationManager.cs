using System;
using WesternStatesWater.WestDaat.Engines;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Accessors;
using DC = WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Managers.Mapping;

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

        public string GetWaterAllocationSiteGeoconnexIntegrationData(string siteUuid)
        {
            var site = _siteAccessor.GetSiteByUuid(siteUuid).Map<DC.Site>();

            // Call accessor to get Allocation -> Organization -> OrganizationDataMappingUrl
            // Pass into engine to build json

            var json = _geoConnexEngine.BuildGeoconnexJson(site);

            return json;
        }
    }
}